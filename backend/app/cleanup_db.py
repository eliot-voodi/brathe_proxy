#!/usr/bin/env python3
"""
Maintenance script for cleaning SQLite panel database from stale data.

Usage examples:
  python3 app/cleanup_db.py --dry-run
  python3 app/cleanup_db.py
  python3 app/cleanup_db.py --events-retention-days 30 --skip-vacuum
"""

from __future__ import annotations

import argparse
import os
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path

DEFAULT_DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:////data/panel.db")
DEFAULT_EVENTS_MAX_ROWS = int(os.environ.get("PRUNE_TRAFFIC_EVENTS_MAX_ROWS", "500000"))
DEFAULT_EVENTS_CHUNK = int(os.environ.get("PRUNE_TRAFFIC_EVENTS_CHUNK", "100000"))
DEFAULT_SAMPLES_RETENTION_HOURS = int(os.environ.get("TRAFFIC_SAMPLES_RETENTION_HOURS", "48"))


@dataclass
class CleanupResult:
    name: str
    deleted: int


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Clean proxy-admin-panel SQLite database from stale rows and old telemetry.",
    )
    parser.add_argument(
        "--database-url",
        default=DEFAULT_DATABASE_URL,
        help="SQLAlchemy URL for SQLite database (default: DATABASE_URL env).",
    )
    parser.add_argument(
        "--samples-retention-hours",
        type=int,
        default=DEFAULT_SAMPLES_RETENTION_HOURS,
        help="Delete traffic_samples older than this value. 0 disables sample pruning.",
    )
    parser.add_argument(
        "--events-max-rows",
        type=int,
        default=DEFAULT_EVENTS_MAX_ROWS,
        help="Keep at most this many rows in traffic_events.",
    )
    parser.add_argument(
        "--events-prune-chunk",
        type=int,
        default=DEFAULT_EVENTS_CHUNK,
        help="Rows deleted per iteration while pruning traffic_events.",
    )
    parser.add_argument(
        "--events-retention-days",
        type=int,
        default=None,
        help="Optionally delete traffic_events older than N days (before max-rows pruning).",
    )
    parser.add_argument(
        "--backup-dir",
        default=None,
        help="Directory for backup file. Default: <db_dir>/backups.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be removed without modifying DB.",
    )
    parser.add_argument(
        "--skip-backup",
        action="store_true",
        help="Skip creating backup before cleanup (ignored in --dry-run).",
    )
    parser.add_argument(
        "--skip-vacuum",
        action="store_true",
        help="Skip VACUUM after cleanup.",
    )
    args = parser.parse_args()

    if args.samples_retention_hours < 0:
        parser.error("--samples-retention-hours must be >= 0")
    if args.events_max_rows < 0:
        parser.error("--events-max-rows must be >= 0")
    if args.events_prune_chunk <= 0:
        parser.error("--events-prune-chunk must be > 0")
    if args.events_retention_days is not None and args.events_retention_days <= 0:
        parser.error("--events-retention-days must be > 0")
    return args


def sqlite_database_path(database_url: str) -> Path:
    if not database_url.startswith("sqlite:"):
        raise ValueError("Only sqlite DATABASE_URL is supported by this script")
    # Supports common SQLAlchemy formats:
    #   sqlite:////data/panel.db
    #   sqlite:///./data/panel.db
    #   sqlite:///data/panel.db
    if not database_url.startswith("sqlite:///"):
        raise ValueError("Expected sqlite:///... DATABASE_URL format")
    db_part = database_url[len("sqlite:///") :]
    if not db_part:
        raise ValueError("SQLite database path is empty in DATABASE_URL")
    if "?" in db_part:
        db_part = db_part.split("?", 1)[0]
    if db_part.startswith("file:"):
        raise ValueError("sqlite file: URI mode is not supported by this script")
    return Path(db_part)


def scalar(conn: sqlite3.Connection, query: str, params: tuple = ()) -> int:
    row = conn.execute(query, params).fetchone()
    return int(row[0]) if row else 0


def table_exists(conn: sqlite3.Connection, table: str) -> bool:
    return (
        conn.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name=? LIMIT 1",
            (table,),
        ).fetchone()
        is not None
    )


def create_sqlite_backup(src_path: Path, backup_dir: Path) -> Path:
    backup_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    backup_path = backup_dir / f"panel-cleanup-backup-{ts}.db"
    src_conn = sqlite3.connect(str(src_path))
    try:
        dst_conn = sqlite3.connect(str(backup_path))
        try:
            src_conn.backup(dst_conn)
        finally:
            dst_conn.close()
    finally:
        src_conn.close()
    return backup_path


def delete_orphan_samples(conn: sqlite3.Connection, dry_run: bool) -> int:
    if not table_exists(conn, "traffic_samples") or not table_exists(conn, "proxy_users"):
        return 0
    where_clause = (
        "user_id IS NOT NULL AND NOT EXISTS ("
        "SELECT 1 FROM proxy_users pu WHERE pu.id = traffic_samples.user_id)"
    )
    count = scalar(conn, f"SELECT COUNT(*) FROM traffic_samples WHERE {where_clause}")
    if dry_run or count == 0:
        return count
    conn.execute(f"DELETE FROM traffic_samples WHERE {where_clause}")
    return count


def delete_orphan_mtproto_state(conn: sqlite3.Connection, dry_run: bool) -> int:
    if not table_exists(conn, "mtproto_user_state") or not table_exists(conn, "proxy_users"):
        return 0
    where_clause = (
        "NOT EXISTS ("
        "SELECT 1 FROM proxy_users pu "
        "WHERE pu.username = mtproto_user_state.username AND pu.allow_mtproto = 1)"
    )
    count = scalar(conn, f"SELECT COUNT(*) FROM mtproto_user_state WHERE {where_clause}")
    if dry_run or count == 0:
        return count
    conn.execute(f"DELETE FROM mtproto_user_state WHERE {where_clause}")
    return count


def prune_old_samples(
    conn: sqlite3.Connection,
    retention_hours: int,
    dry_run: bool,
) -> int:
    if not table_exists(conn, "traffic_samples"):
        return 0
    if retention_hours <= 0:
        return 0
    cutoff = datetime.now(timezone.utc) - timedelta(hours=retention_hours)
    cutoff_str = cutoff.strftime("%Y-%m-%d %H:%M:%S")
    where_clause = "captured_at IS NOT NULL AND datetime(captured_at) < datetime(?)"
    count = scalar(
        conn,
        f"SELECT COUNT(*) FROM traffic_samples WHERE {where_clause}",
        (cutoff_str,),
    )
    if dry_run or count == 0:
        return count
    conn.execute(f"DELETE FROM traffic_samples WHERE {where_clause}", (cutoff_str,))
    return count


def prune_old_events(
    conn: sqlite3.Connection,
    retention_days: int | None,
    chunk: int,
    dry_run: bool,
) -> int:
    if not table_exists(conn, "traffic_events"):
        return 0
    if retention_days is None:
        return 0
    cutoff = datetime.now(timezone.utc) - timedelta(days=retention_days)
    cutoff_str = cutoff.strftime("%Y-%m-%d %H:%M:%S")
    where_clause = "logged_at IS NOT NULL AND datetime(logged_at) < datetime(?)"
    count = scalar(
        conn,
        f"SELECT COUNT(*) FROM traffic_events WHERE {where_clause}",
        (cutoff_str,),
    )
    if dry_run or count == 0:
        return count
    deleted = 0
    while True:
        before = conn.total_changes
        conn.execute(
            "DELETE FROM traffic_events WHERE id IN ("
            "SELECT id FROM traffic_events "
            "WHERE logged_at IS NOT NULL AND datetime(logged_at) < datetime(?) "
            "ORDER BY id ASC LIMIT ?)",
            (cutoff_str, chunk),
        )
        diff = conn.total_changes - before
        if diff <= 0:
            break
        deleted += diff
        if diff < chunk:
            break
    return deleted


def prune_events_to_max_rows(
    conn: sqlite3.Connection,
    max_rows: int,
    chunk: int,
    dry_run: bool,
) -> int:
    if not table_exists(conn, "traffic_events"):
        return 0
    current = scalar(conn, "SELECT COUNT(*) FROM traffic_events")
    to_delete = max(0, current - max_rows)
    if dry_run or to_delete == 0:
        return to_delete
    deleted = 0
    while deleted < to_delete:
        limit = min(chunk, to_delete - deleted)
        before = conn.total_changes
        conn.execute(
            "DELETE FROM traffic_events WHERE id IN ("
            "SELECT id FROM traffic_events ORDER BY id ASC LIMIT ?)",
            (limit,),
        )
        diff = conn.total_changes - before
        if diff <= 0:
            break
        deleted += diff
    return deleted


def table_count(conn: sqlite3.Connection, table: str) -> int:
    if not table_exists(conn, table):
        return 0
    return scalar(conn, f"SELECT COUNT(*) FROM {table}")


def main() -> int:
    args = parse_args()
    db_path = sqlite_database_path(args.database_url)
    if not db_path.exists():
        print(f"[ERROR] SQLite DB not found: {db_path}")
        return 1

    backup_dir = Path(args.backup_dir) if args.backup_dir else (db_path.parent / "backups")
    db_size_before = db_path.stat().st_size
    print(f"DB: {db_path}")
    print(f"Mode: {'DRY-RUN' if args.dry_run else 'EXECUTE'}")

    if not args.dry_run and not args.skip_backup:
        backup_path = create_sqlite_backup(db_path, backup_dir)
        print(f"Backup created: {backup_path}")

    conn = sqlite3.connect(str(db_path))
    try:
        conn.execute("PRAGMA busy_timeout = 5000")
        before_counts = {
            "proxy_users": table_count(conn, "proxy_users"),
            "traffic_samples": table_count(conn, "traffic_samples"),
            "traffic_events": table_count(conn, "traffic_events"),
            "mtproto_user_state": table_count(conn, "mtproto_user_state"),
        }

        results: list[CleanupResult] = []
        results.append(CleanupResult("orphan traffic_samples", delete_orphan_samples(conn, args.dry_run)))
        results.append(CleanupResult("orphan mtproto_user_state", delete_orphan_mtproto_state(conn, args.dry_run)))
        results.append(
            CleanupResult(
                f"traffic_samples older than {args.samples_retention_hours}h",
                prune_old_samples(conn, args.samples_retention_hours, args.dry_run),
            )
        )
        results.append(
            CleanupResult(
                "traffic_events by retention",
                prune_old_events(conn, args.events_retention_days, args.events_prune_chunk, args.dry_run),
            )
        )
        results.append(
            CleanupResult(
                f"traffic_events over {args.events_max_rows} rows",
                prune_events_to_max_rows(
                    conn,
                    max_rows=args.events_max_rows,
                    chunk=args.events_prune_chunk,
                    dry_run=args.dry_run,
                ),
            )
        )

        if args.dry_run:
            conn.rollback()
        else:
            conn.commit()
    finally:
        conn.close()

    if not args.dry_run and not args.skip_vacuum:
        with sqlite3.connect(str(db_path)) as vacuum_conn:
            vacuum_conn.execute("VACUUM")

    with sqlite3.connect(str(db_path)) as conn_after:
        after_counts = {
            "proxy_users": table_count(conn_after, "proxy_users"),
            "traffic_samples": table_count(conn_after, "traffic_samples"),
            "traffic_events": table_count(conn_after, "traffic_events"),
            "mtproto_user_state": table_count(conn_after, "mtproto_user_state"),
        }

    db_size_after = db_path.stat().st_size

    print("")
    print("Cleanup results:")
    for item in results:
        action = "would delete" if args.dry_run else "deleted"
        print(f"  - {item.name}: {action} {item.deleted}")
    print("")
    print("Row counts:")
    for table in ("proxy_users", "traffic_samples", "traffic_events", "mtproto_user_state"):
        print(f"  - {table}: {before_counts[table]} -> {after_counts[table]}")
    print("")
    print(f"DB size: {db_size_before} -> {db_size_after} bytes")
    if args.dry_run:
        print("No changes were written (--dry-run).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
