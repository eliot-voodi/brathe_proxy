#!/bin/sh
set -eu

CONFIG_PATH="/config/config.toml"

while [ ! -f "$CONFIG_PATH" ]; do
  echo "waiting for $CONFIG_PATH"
  sleep 1
done

echo "starting telemt with $CONFIG_PATH"
exec /usr/local/bin/telemt "$CONFIG_PATH"
