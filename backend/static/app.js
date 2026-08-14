const loginOverlay = document.getElementById("loginOverlay");
const appContainer = document.getElementById("appContainer");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const loginStatusEl = document.getElementById("loginStatus");
const statusEl = document.getElementById("status");
const usersBody = document.getElementById("usersTableBody");
const createForm = document.getElementById("createUserForm");
const usersTabBtn = document.getElementById("usersTabBtn");
const vlessTabBtn = document.getElementById("vlessTabBtn");
const operatorsTabBtn = document.getElementById("operatorsTabBtn");
const analyticsTabBtn = document.getElementById("analyticsTabBtn");
const connectionsTabBtn = document.getElementById("connectionsTabBtn");
const usersSection = document.getElementById("usersSection");
const trafficSummarySection = document.getElementById("trafficSummarySection");
const usersTableSection = document.getElementById("usersTableSection");
const operatorsSection = document.getElementById("operatorsSection");
const operatorsTableBody = document.getElementById("operatorsTableBody");
const createOperatorForm = document.getElementById("createOperatorForm");
const navOperatorsBadge = document.getElementById("navOperatorsBadge");
const onlineTotalBadge = document.getElementById("onlineTotalBadge");
const liveRefreshBadge = document.getElementById("liveRefreshBadge");
const summaryAllTimeIn = document.getElementById("summaryAllTimeIn");
const summaryAllTimeOut = document.getElementById("summaryAllTimeOut");
const summaryAllTimeTotal = document.getElementById("summaryAllTimeTotal");
const summaryMonthLabel = document.getElementById("summaryMonthLabel");
const summaryMonthIn = document.getElementById("summaryMonthIn");
const summaryMonthOut = document.getElementById("summaryMonthOut");
const summaryMonthTotal = document.getElementById("summaryMonthTotal");
const summaryFirstConnection = document.getElementById("summaryFirstConnection");
const kpiUsersTotal = document.getElementById("kpiUsersTotal");
const kpiOnlineNow = document.getElementById("kpiOnlineNow");
const kpiVlessState = document.getElementById("kpiVlessState");
const kpiVlessMeta = document.getElementById("kpiVlessMeta");
const kpiPorts = document.getElementById("kpiPorts");
const vlessSection = document.getElementById("vlessSection");
const analyticsSection = document.getElementById("analyticsSection");
const connectionsSection = document.getElementById("connectionsSection");
const connectionsTableBody = document.getElementById("connectionsTableBody");
const connectionsSearchInput = document.getElementById("connectionsSearchInput");
const connectionsUsersBadge = document.getElementById("connectionsUsersBadge");
const connectionsLiveBadge = document.getElementById("connectionsLiveBadge");
const connectionsTotalHttp = document.getElementById("connectionsTotalHttp");
const connectionsTotalMtproto = document.getElementById("connectionsTotalMtproto");
const connectionsTotalAll = document.getElementById("connectionsTotalAll");
const connectionsPagination = document.getElementById("connectionsPagination");
const connectionsPagePrev = document.getElementById("connectionsPagePrev");
const connectionsPageNext = document.getElementById("connectionsPageNext");
const connectionsPageInfo = document.getElementById("connectionsPageInfo");
const archiveMenuBtn = document.getElementById("archiveMenuBtn");
const archiveMenu = document.getElementById("archiveMenu");
const usersSearchInput = document.getElementById("usersSearchInput");
const importTemplateBtn = document.getElementById("importTemplateBtn");
const importUsersInput = document.getElementById("importUsersInput");
const reportUsersBtn = document.getElementById("reportUsersBtn");
const reportLinksBtn = document.getElementById("reportLinksBtn");
const backupBtn = document.getElementById("backupBtn");
const restoreInput = document.getElementById("restoreInput");
const chartUserSelect = document.getElementById("chartUserSelect");
const chartRangeSelect = document.getElementById("chartRangeSelect");
const chartRefreshBtn = document.getElementById("chartRefreshBtn");
const trafficChartCanvas = document.getElementById("trafficChart");
const statIn = document.getElementById("statIn");
const statOut = document.getElementById("statOut");
const statTotal = document.getElementById("statTotal");
const httpPortLabel = document.getElementById("httpPortLabel");
const mtprotoPortLabel = document.getElementById("mtprotoPortLabel");
const vlessBadge = document.getElementById("vlessBadge");
const authUserLabel = document.getElementById("authUserLabel");
const brandSubEl = document.getElementById("pageSubtitle") || document.querySelector(".brand-sub");
const brandSubDefault = brandSubEl ? brandSubEl.textContent : "";
const pageTitleEl = document.getElementById("pageTitle");
const navUsersBadge = document.getElementById("navUsersBadge");
const navOnlineBadge = document.getElementById("navOnlineBadge");
const navVlessDot = document.getElementById("navVlessDot");
const usernamePrefixAddon = document.getElementById("usernamePrefixAddon");
const createUsernameInput = document.getElementById("createUsernameInput");
let authState = { username: "", is_admin: true, username_prefix: null };
const vlessForm = document.getElementById("vlessForm");
const vlessEnabled = document.getElementById("vlessEnabled");
const vlessLinkInput = document.getElementById("vlessLinkInput");
const vlessFormHint = document.getElementById("vlessFormHint");
const httpCredsModal = document.getElementById("httpCredsModal");
const httpUserValue = document.getElementById("httpUserValue");
const httpPassValue = document.getElementById("httpPassValue");
const httpUrlValue = document.getElementById("httpUrlValue");
const copyHttpCredsBtn = document.getElementById("copyHttpCredsBtn");
const closeHttpCredsBtn = document.getElementById("closeHttpCredsBtn");
const limitsModal = document.getElementById("limitsModal");
const limitsForm = document.getElementById("limitsForm");
const mtprotoModal = document.getElementById("mtprotoModal");
const mtprotoForm = document.getElementById("mtprotoForm");
const mtprotoUserId = document.getElementById("mtprotoUserId");
const mtprotoModalLead = document.getElementById("mtprotoModalLead");
const editAllowMtproto = document.getElementById("editAllowMtproto");
const mtprotoEditDetails = document.getElementById("mtprotoEditDetails");
const editRegenerateMtprotoSecret = document.getElementById("editRegenerateMtprotoSecret");
const mtprotoBotHexValue = document.getElementById("mtprotoBotHexValue");
const copyMtprotoBotHexBtn = document.getElementById("copyMtprotoBotHexBtn");
const editMtprotoAdEnabled = document.getElementById("editMtprotoAdEnabled");
const mtprotoEditAdFields = document.getElementById("mtprotoEditAdFields");
const editMtprotoAdChannel = document.getElementById("editMtprotoAdChannel");
const editMtprotoAdTag = document.getElementById("editMtprotoAdTag");
const closeMtprotoBtn = document.getElementById("closeMtprotoBtn");
const limitsUserId = document.getElementById("limitsUserId");
const limitsExpiresInput = document.getElementById("limitsExpiresInput");
const limitsGbInput = document.getElementById("limitsGbInput");
const closeLimitsBtn = document.getElementById("closeLimitsBtn");
const usersPagination = document.getElementById("usersPagination");
const usersPagePrev = document.getElementById("usersPagePrev");
const usersPageNext = document.getElementById("usersPageNext");
const usersPageInfo = document.getElementById("usersPageInfo");
const allowMtprotoCheckbox = document.getElementById("allowMtprotoCheckbox");
const mtprotoAdBlock = document.getElementById("mtprotoAdBlock");
const mtprotoAdEnabledCheckbox = document.getElementById("mtprotoAdEnabledCheckbox");
const mtprotoAdFields = document.getElementById("mtprotoAdFields");

let panelMeta = {
  proxy_public_host: "127.0.0.1",
  proxy_public_mtproto_host: "127.0.0.1",
  proxy_public_http_port: 13128,
  proxy_public_mtproto_port: 2053,
  vless_active: false,
  vless_clients_chained: false,
  vless_singbox_restart_pending: false,
};
let currentHttpCredsText = "";
let currentMtprotoBotHex = "";
let usersCache = [];
let usersTableTotal = 0;
const USERS_PAGE_SIZE = 20;
let usersListPage = 1;
let usersSortBy = "id";
let usersSortDir = "asc";
let usersSearchDebounce = null;
let connectionsCache = [];
let connectionsTableTotal = 0;
const CONNECTIONS_PAGE_SIZE = 20;
let connectionsListPage = 1;
let connectionsSortBy = "connections_total";
let connectionsSortDir = "desc";
let connectionsSearchDebounce = null;
let connectionsRefreshInFlight = false;
const LIVE_REFRESH_INTERVAL_MS = 12000;
const CHART_REFRESH_INTERVAL_MS = 60000;
let usersRefreshInFlight = false;
let liveRefreshTimer = null;
let chartRefreshTimer = null;
let trafficChart = null;

function updateUsersSortHeaders() {
  const headers = document.querySelectorAll("#usersTableSection th.sortable[data-sort]");
  headers.forEach((th) => {
    const field = th.dataset.sort;
    const indicator = th.querySelector(".sort-indicator");
    const active = field === usersSortBy;
    th.classList.toggle("sort-active", active);
    th.setAttribute("aria-sort", active ? (usersSortDir === "asc" ? "ascending" : "descending") : "none");
    if (indicator) {
      indicator.textContent = active ? (usersSortDir === "asc" ? "↑" : "↓") : "⇅";
    }
  });
}

function initUsersTableSort() {
  const headers = document.querySelectorAll("#usersTableSection th.sortable[data-sort]");
  headers.forEach((th) => {
    th.addEventListener("click", () => {
      const field = th.dataset.sort;
      if (!field) return;
      if (usersSortBy === field) {
        usersSortDir = usersSortDir === "asc" ? "desc" : "asc";
      } else {
        usersSortBy = field;
        usersSortDir = "asc";
      }
      usersListPage = 1;
      updateUsersSortHeaders();
      loadUsers({ forceFullRender: true });
    });
  });
  updateUsersSortHeaders();
}

function updateUsersPaginationUi(total, totalPages) {
  if (!usersPagination) return;
  if (total <= USERS_PAGE_SIZE) {
    usersPagination.classList.add("hidden");
    return;
  }
  usersPagination.classList.remove("hidden");
  if (usersPageInfo) {
    usersPageInfo.textContent = `Страница ${usersListPage} из ${totalPages} · всего ${total}`;
  }
  if (usersPagePrev) usersPagePrev.disabled = usersListPage <= 1;
  if (usersPageNext) usersPageNext.disabled = usersListPage >= totalPages;
}

function renderUsersTable({ forceFullRender = false } = {}) {
  const total = usersTableTotal;
  if (!total) {
    usersBody.innerHTML = "";
    const tr = document.createElement("tr");
    const q = String(usersSearchInput?.value || "").trim();
    tr.innerHTML = `<td colspan="10" class="empty-users">${q ? "Ничего не найдено" : "Пользователей пока нет"}</td>`;
    usersBody.appendChild(tr);
    if (usersPagination) usersPagination.classList.add("hidden");
    return;
  }

  const totalPages = Math.max(1, Math.ceil(total / USERS_PAGE_SIZE));
  const existingRows = [...usersBody.querySelectorAll("tr[data-user-id]")];
  const canPatch =
    !forceFullRender &&
    existingRows.length === usersCache.length &&
    existingRows.every((row, index) => row.dataset.userId === String(usersCache[index]?.id));

  if (canPatch) {
    existingRows.forEach((row, index) => updateUserRowInPlace(row, usersCache[index]));
  } else {
    usersBody.innerHTML = "";
    usersCache.forEach((u) => usersBody.appendChild(userRow(u)));
  }
  updateUsersPaginationUi(total, totalPages);
}

function setLiveBadgePaused(paused) {
  if (!liveRefreshBadge) return;
  liveRefreshBadge.classList.toggle("paused", paused);
  liveRefreshBadge.title = paused
    ? "Автообновление приостановлено (вкладка неактивна)"
    : "Данные обновляются автоматически каждые 3 секунды";
}

function formatProtocolConnectionsCell(tcp, ips, allowed) {
  if (!allowed) return '<span class="cell-no">—</span>';
  const t = Number(tcp) || 0;
  const i = Number(ips) || 0;
  const text = `${t} TCP · ${i} IP`;
  if (t === 0 && i === 0) {
    return `<span class="cell-muted" title="TCP-сессии · уникальные IP">${text}</span>`;
  }
  return `<span class="cell-yes" title="TCP-сессии · уникальные IP">${text}</span>`;
}

function formatProtoCell(user) {
  const chip = (letter, on, title) =>
    `<span class="proto-chip ${on ? "on" : "off"}" title="${title}">${letter}</span>`;
  const mtTitle = user.allow_mtproto
    ? user.mtproto_ad_enabled
      ? "MTProto + реклама"
      : "MTProto"
    : "MTProto выкл.";
  return `${chip("H", user.allow_http, user.allow_http ? "HTTP" : "HTTP выкл.")}${chip("M", user.allow_mtproto, mtTitle)}`;
}

function onlineStatusPillCompact(user) {
  const last = formatLastOnlineCell(user);
  const title = last !== "—" ? `Был онлайн: ${last}` : "";
  if (user.is_online) {
    return `<span class="status-pill ok status-pill-compact" title="${title}">On</span>`;
  }
  if (user.is_idle) {
    return `<span class="status-pill info status-pill-compact" title="${title}">Wait</span>`;
  }
  return `<span class="status-pill warn status-pill-compact" title="${title}">Off</span>`;
}

function formatUserStatusCell(user) {
  if (user.access_allowed === false) {
    return '<span class="status-pill bad status-pill-compact" title="Доступ заблокирован">Block</span>';
  }
  return onlineStatusPillCompact(user);
}

function formatLimitsCompactCell(user) {
  const parts = [];
  if (user.expires_at) {
    try {
      const d = new Date(user.expires_at);
      if (!Number.isNaN(d.getTime())) {
        parts.push(
          `до ${d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "2-digit" })}`
        );
      }
    } catch (_e) {}
  }
  if (user.traffic_limit_bytes != null && user.traffic_limit_bytes > 0) {
    parts.push(`≤${formatBytes(user.traffic_limit_bytes)}`);
  }
  if (!parts.length) return "—";
  const text = parts.join(" · ");
  const detail = [];
  if (user.expires_at) detail.push(`До: ${formatExpiresCell(user)}`);
  if (user.traffic_limit_bytes > 0) detail.push(formatLimitCell(user));
  return `<span class="cell-limits" title="${detail.join(" · ")}">${text}</span>`;
}

function formatTotalTrafficCellCompact(user) {
  const total = formatBytes(user.traffic_bytes);
  const sinceRaw = user.first_connection_at || user.created_at;
  if (!sinceRaw || (!user.traffic_bytes && !user.requests_count)) {
    return total;
  }
  try {
    const start = new Date(sinceRaw);
    if (Number.isNaN(start.getTime())) return total;
    const dateStr = start.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const daysStr = formatDaysSince(start.getTime());
    return `<span title="С ${dateStr} · ${daysStr}">${total}</span>`;
  } catch (_e) {
    return total;
  }
}

function closeAllRowMenus() {
  document.querySelectorAll(".row-menu").forEach((menu) => {
    menu.classList.add("hidden");
    menu.classList.remove("is-open", "open-up");
    menu.style.top = "";
    menu.style.left = "";
    menu.style.right = "";
    menu.style.bottom = "";
    const host = menu.dataset.hostId ? document.getElementById(menu.dataset.hostId) : null;
    if (host && menu.parentElement !== host) {
      host.appendChild(menu);
    }
  });
}

function positionRowMenu(menu, anchorBtn) {
  const rect = anchorBtn.getBoundingClientRect();
  const menuWidth = 248;
  const gap = 8;
  const viewportPad = 12;
  document.body.appendChild(menu);
  menu.classList.remove("hidden");
  menu.classList.add("is-open");
  const menuHeight = Math.min(menu.scrollHeight || 280, window.innerHeight - viewportPad * 2);
  let left = rect.right - menuWidth;
  left = Math.max(viewportPad, Math.min(left, window.innerWidth - menuWidth - viewportPad));
  const spaceBelow = window.innerHeight - rect.bottom - gap;
  const spaceAbove = rect.top - gap;
  const openUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;
  menu.classList.toggle("open-up", openUp);
  let top = openUp ? rect.top - gap - menuHeight : rect.bottom + gap;
  top = Math.max(viewportPad, Math.min(top, window.innerHeight - menuHeight - viewportPad));
  menu.style.left = `${Math.round(left)}px`;
  menu.style.top = `${Math.round(top)}px`;
  menu.style.right = "auto";
  menu.style.bottom = "auto";
}

function userRowActionsMenuHtml(user) {
  const hostId = `row-menu-host-${user.id}`;
  const canDelete = authState.is_admin !== false;
  return `
    <div class="menu-wrap row-actions-menu" id="${hostId}">
      <button type="button" class="btn btn-secondary btn-compact row-menu-btn" aria-label="Действия для ${user.username}" aria-haspopup="menu">⋯</button>
      <div class="menu row-menu hidden" role="menu" data-host-id="${hostId}">
        <div class="menu-section-label">Протоколы</div>
        <button type="button" class="menu-item-btn" data-action="toggle-http" role="menuitem">${user.allow_http ? "Выключить HTTP" : "Включить HTTP"}</button>
        <button type="button" class="menu-item-btn" data-action="toggle-mtproto" role="menuitem">${user.allow_mtproto ? "Выключить MTProto" : "Включить MTProto"}</button>
        <div class="menu-section-label">Доступ</div>
        <button type="button" class="menu-item-btn" data-action="limits" role="menuitem">Срок и лимиты…</button>
        <button type="button" class="menu-item-btn" data-action="edit-mtproto" role="menuitem">Настройки MTProto…</button>
        <button type="button" class="menu-item-btn" data-action="http-creds" role="menuitem">Показать HTTP доступ</button>
        <button type="button" class="menu-item-btn" data-action="copy-mtproto" role="menuitem">Скопировать TG MTProto</button>
        ${
          canDelete
            ? `<div class="menu-divider"></div>
        <button type="button" class="menu-item-btn menu-item-danger" data-action="delete" role="menuitem">Удалить пользователя</button>`
            : ""
        }
      </div>
    </div>`;
}

function bindUserRowActions(tr, user) {
  const mtprotoLink = `tg://proxy?server=${encodeURIComponent(panelMeta.proxy_public_mtproto_host || panelMeta.proxy_public_host)}&port=${encodeURIComponent(String(panelMeta.proxy_public_mtproto_port || 14443))}&secret=${encodeURIComponent(user.mtproto_secret || "")}`;
  const accessOk = user.access_allowed !== false;
  const menuBtn = tr.querySelector(".row-menu-btn");
  const menu = tr.querySelector(".row-menu");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const wasOpen = !menu.classList.contains("hidden");
      closeAllRowMenus();
      if (!wasOpen) positionRowMenu(menu, menuBtn);
    });
    menu.addEventListener("click", (event) => event.stopPropagation());
  }
  const closeMenu = () => closeAllRowMenus();
  tr.querySelector('[data-action="toggle-http"]')?.addEventListener("click", async () => {
    closeMenu();
    await updateUser(user.id, { allow_http: !user.allow_http });
  });
  tr.querySelector('[data-action="toggle-mtproto"]')?.addEventListener("click", async () => {
    closeMenu();
    await updateUser(user.id, { allow_mtproto: !user.allow_mtproto });
  });
  tr.querySelector('[data-action="limits"]')?.addEventListener("click", () => {
    closeMenu();
    openLimitsModal(user);
  });
  tr.querySelector('[data-action="edit-mtproto"]')?.addEventListener("click", () => {
    closeMenu();
    openMtprotoModal(user);
  });
  tr.querySelector('[data-action="delete"]')?.addEventListener("click", async () => {
    closeMenu();
    if (!confirm(`Удалить пользователя ${user.username}?`)) return;
    try {
      await api(`/api/users/${user.id}`, { method: "DELETE" });
      setStatus(`Пользователь ${user.username} удален`);
      await loadUsers({ forceFullRender: true });
    } catch (e) {
      setStatus(e.message, true);
    }
  });
  tr.querySelector('[data-action="copy-mtproto"]')?.addEventListener("click", async () => {
    closeMenu();
    if (!accessOk) {
      setStatus("Доступ заблокирован (срок или лимит трафика)", true);
      return;
    }
    if (!user.allow_mtproto || !user.mtproto_secret) {
      setStatus("У пользователя выключен MTProto", true);
      return;
    }
    const copied = await copyToClipboard(mtprotoLink);
    if (copied) {
      setStatus(`MTProto ссылка скопирована для ${user.username}`);
    } else {
      setStatus(`Скопируйте вручную: ${mtprotoLink}`, true);
    }
  });
  tr.querySelector('[data-action="http-creds"]')?.addEventListener("click", () => {
    closeMenu();
    if (!accessOk) {
      setStatus("Доступ заблокирован (срок или лимит трафика)", true);
      return;
    }
    if (!user.allow_http) {
      setStatus("У пользователя выключен HTTP", true);
      return;
    }
    const host = panelMeta.proxy_public_host;
    const httpPort = panelMeta.proxy_public_http_port || 13128;
    const url = `http://${user.username}:${user.password}@${host}:${httpPort}`;
    httpUserValue.textContent = user.username;
    httpPassValue.textContent = user.password;
    httpUrlValue.textContent = url;
    currentHttpCredsText = `HTTP Proxy\nHost: ${host}\nPort: ${httpPort}\nUsername: ${user.username}\nPassword: ${user.password}\nURL: ${url}`;
    openHttpCredsModal();
  });
}

function updateUserRowInPlace(tr, user) {
  if (!tr || !user) return;
  const setCell = (label, html) => {
    const td = tr.querySelector(`td[data-label="${label}"]`);
    if (td) td.innerHTML = html;
  };
  setCell("Пр.", formatProtoCell(user));
  setCell("↓", formatBytes(user.traffic_in_bytes));
  setCell("↑", formatBytes(user.traffic_out_bytes));
  setCell("Σ", formatTotalTrafficCellCompact(user));
  setCell("#req", String(user.requests_count));
  setCell("Статус", formatUserStatusCell(user));
  setCell("Срок", formatLimitsCompactCell(user));
}

function openHttpCredsModal() {
  httpCredsModal.classList.remove("hidden");
  httpCredsModal.style.display = "flex";
}

function closeHttpCredsModal() {
  httpCredsModal.classList.add("hidden");
  httpCredsModal.style.display = "none";
}

function closeArchiveMenu() {
  archiveMenu.classList.add("hidden");
}

function setPageHeader(title, subtitle) {
  if (pageTitleEl) pageTitleEl.textContent = title;
  if (brandSubEl && !authState.username_prefix) {
    brandSubEl.textContent = subtitle;
  } else if (brandSubEl && authState.username_prefix) {
    brandSubEl.textContent = `Доступ только к шаблону ${authState.username_prefix}*`;
  } else if (brandSubEl) {
    brandSubEl.textContent = subtitle;
  }
}

function clearMainTabs() {
  usersSection.classList.add("hidden");
  if (trafficSummarySection) trafficSummarySection.classList.add("hidden");
  usersTableSection.classList.add("hidden");
  vlessSection.classList.add("hidden");
  if (operatorsSection) operatorsSection.classList.add("hidden");
  analyticsSection.classList.add("hidden");
  connectionsSection.classList.add("hidden");
  [usersTabBtn, vlessTabBtn, operatorsTabBtn, analyticsTabBtn, connectionsTabBtn].forEach((btn) => {
    if (!btn) return;
    btn.classList.remove("tab-active");
    btn.setAttribute("aria-selected", "false");
  });
}

function activateTab(btn) {
  if (!btn) return;
  btn.classList.add("tab-active");
  btn.setAttribute("aria-selected", "true");
}

function showUsersTab() {
  clearMainTabs();
  usersSection.classList.remove("hidden");
  usersTableSection.classList.remove("hidden");
  activateTab(usersTabBtn);
  setPageHeader("Пользователи", "Список, трафик и действия по прокси-аккаунтам");
}

function showVlessTab() {
  clearMainTabs();
  vlessSection.classList.remove("hidden");
  activateTab(vlessTabBtn);
  setPageHeader("VLESS", "Цепочка для HTTP и MTProto через sing-box");
}

function showOperatorsTab() {
  clearMainTabs();
  if (operatorsSection) operatorsSection.classList.remove("hidden");
  activateTab(operatorsTabBtn);
  setPageHeader("Операторы", "Управление входом в панель и шаблонами доступа");
}

function showAnalyticsTab() {
  clearMainTabs();
  if (trafficSummarySection) trafficSummarySection.classList.remove("hidden");
  analyticsSection.classList.remove("hidden");
  activateTab(analyticsTabBtn);
  setPageHeader("Трафик", "Сводка и утилизация по выборкам");
}

function showConnectionsTab() {
  clearMainTabs();
  connectionsSection.classList.remove("hidden");
  activateTab(connectionsTabBtn);
  setPageHeader("Online", "Активные подключения по протоколам");
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.classList.remove("status-ok", "status-err");
  if (!msg) return;
  statusEl.classList.add(isError ? "status-err" : "status-ok");
}

function metricStats(arr) {
  if (!arr.length) return { min: 0, max: 0, avg: 0 };
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  return { min, max, avg };
}

function formatRate(bytesPerSecond) {
  return `${formatBytes(bytesPerSecond)}/s`;
}

function accessStatusPill(user) {
  if (user.access_allowed !== false) {
    return '<span class="status-pill ok">Активен</span>';
  }
  return '<span class="status-pill bad">Заблокирован</span>';
}

function onlineStatusPill(user) {
  if (user.is_online) {
    return '<span class="status-pill ok">Онлайн</span>';
  }
  if (user.is_idle) {
    return '<span class="status-pill info" title="Есть недавнее подключение, но трафик меньше 1 минуты">Подключен</span>';
  }
  return '<span class="status-pill warn">Оффлайн</span>';
}

function formatLastOnlineCell(user) {
  if (!user.last_online_at) return "—";
  try {
    const dt = new Date(user.last_online_at);
    if (Number.isNaN(dt.getTime())) return "—";
    return dt.toLocaleString();
  } catch (_e) {
    return "—";
  }
}

function formatExpiresCell(user) {
  if (!user.expires_at) return "—";
  try {
    return new Date(user.expires_at).toLocaleString();
  } catch (_e) {
    return "—";
  }
}

function formatLimitCell(user) {
  if (user.traffic_limit_bytes == null || user.traffic_limit_bytes <= 0) return "—";
  return `${formatBytes(user.traffic_limit_bytes)} (${formatBytes(user.traffic_bytes)} исп.)`;
}

function formatDaysSince(startMs) {
  const days = Math.max(1, Math.ceil((Date.now() - startMs) / 86400000));
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return `${days} день`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${days} дня`;
  return `${days} дн.`;
}

function formatFirstConnectionSince(isoDate) {
  if (!isoDate) return null;
  try {
    const start = new Date(isoDate);
    if (Number.isNaN(start.getTime())) return null;
    const dateStr = start.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return { dateStr, daysStr: formatDaysSince(start.getTime()) };
  } catch (_e) {
    return null;
  }
}

function renderSummaryTotalDd(el, bytes, sinceIso) {
  if (!el) return;
  const total = formatBytes(bytes || 0);
  const since = formatFirstConnectionSince(sinceIso);
  if (!since || !bytes) {
    el.textContent = total;
    return;
  }
  el.innerHTML = `<span class="traffic-summary-total-main">${total}</span><span class="traffic-summary-total-sub">с ${since.dateStr} · ${since.daysStr}</span>`;
}

function formatTotalTrafficCell(user) {
  const total = formatBytes(user.traffic_bytes);
  if (!user.traffic_bytes && !user.requests_count) {
    return `<span class="cell-total-main">${total}</span>`;
  }
  const sinceRaw = user.first_connection_at || user.created_at;
  if (!sinceRaw) {
    return `<span class="cell-total-main">${total}</span>`;
  }
  try {
    const start = new Date(sinceRaw);
    if (Number.isNaN(start.getTime())) {
      return `<span class="cell-total-main">${total}</span>`;
    }
    const dateStr = start.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const daysStr = formatDaysSince(start.getTime());
    return `<span class="cell-total-main">${total}</span><span class="cell-total-sub" title="С первого подключения">с ${dateStr} · ${daysStr}</span>`;
  } catch (_e) {
    return `<span class="cell-total-main">${total}</span>`;
  }
}

function openLimitsModal(user) {
  limitsUserId.value = String(user.id);
  if (user.expires_at) {
    limitsExpiresInput.value = formatDateTimeLocal(new Date(user.expires_at));
  } else {
    limitsExpiresInput.value = "";
  }
  if (user.traffic_limit_bytes != null && user.traffic_limit_bytes > 0) {
    limitsGbInput.value = (user.traffic_limit_bytes / 1024 ** 3).toFixed(3);
  } else {
    limitsGbInput.value = "";
  }
  limitsModal.classList.remove("hidden");
  limitsModal.style.display = "flex";
}

function closeLimitsModal() {
  limitsModal.classList.add("hidden");
  limitsModal.style.display = "none";
}

function mtprotoBotHexFromSecret(secret) {
  const s = String(secret || "").trim().toLowerCase();
  if ((s.startsWith("ee") || s.startsWith("dd")) && s.length >= 34) {
    return s.slice(2, 34);
  }
  return "";
}

function syncMtprotoEditModalVisibility() {
  if (!editAllowMtproto || !mtprotoEditDetails) return;
  const on = editAllowMtproto.checked;
  mtprotoEditDetails.classList.toggle("hidden", !on);
  if (!on && editRegenerateMtprotoSecret) {
    editRegenerateMtprotoSecret.checked = false;
  }
  if (mtprotoEditAdFields && editMtprotoAdEnabled) {
    mtprotoEditAdFields.classList.toggle("hidden", !on || !editMtprotoAdEnabled.checked);
  }
}

function refreshMtprotoBotHexDisplay(secret) {
  currentMtprotoBotHex = mtprotoBotHexFromSecret(secret);
  if (mtprotoBotHexValue) {
    mtprotoBotHexValue.textContent = currentMtprotoBotHex || "—";
  }
}

function openMtprotoModal(user) {
  if (!mtprotoModal || !mtprotoForm || !mtprotoUserId) return;
  mtprotoUserId.value = String(user.id);
  if (mtprotoModalLead) {
    mtprotoModalLead.textContent = `Пользователь: ${user.username}`;
  }
  if (editAllowMtproto) editAllowMtproto.checked = !!user.allow_mtproto;
  if (editRegenerateMtprotoSecret) editRegenerateMtprotoSecret.checked = false;
  if (editMtprotoAdEnabled) editMtprotoAdEnabled.checked = !!user.mtproto_ad_enabled;
  if (editMtprotoAdChannel) editMtprotoAdChannel.value = user.mtproto_ad_channel || "";
  if (editMtprotoAdTag) editMtprotoAdTag.value = user.mtproto_ad_tag || "";
  refreshMtprotoBotHexDisplay(user.mtproto_secret);
  syncMtprotoEditModalVisibility();
  mtprotoModal.classList.remove("hidden");
  mtprotoModal.style.display = "flex";
}

function closeMtprotoModal() {
  if (!mtprotoModal) return;
  mtprotoModal.classList.add("hidden");
  mtprotoModal.style.display = "none";
}

function formatDateTimeLocal(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function copyToClipboard(text) {
  if (!text) return false;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_err) {
      // Fallback below for non-secure contexts/browser restrictions.
    }
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  area.style.pointerEvents = "none";
  document.body.appendChild(area);
  area.focus();
  area.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (_err) {
    copied = false;
  }
  document.body.removeChild(area);
  return copied;
}

async function api(path, options = {}) {
  const response = await fetch(path, options);
  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      detail = data.detail || detail;
    } catch (_e) {}
    throw new Error(detail);
  }
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response;
}

function userAvatarHtml(username) {
  const raw = String(username || "?").trim();
  const parts = raw.replace(/^depish_/, "").split(/[_\s.]+/).filter(Boolean);
  const initials = ((parts[0]?.[0] || raw[0] || "?") + (parts[1]?.[0] || "")).toUpperCase().slice(0, 2);
  return `<span class="user-avatar" aria-hidden="true">${initials}</span>`;
}

function userCellHtml(user) {
  return `<div class="user-cell">${userAvatarHtml(user.username)}<div class="user-meta"><span class="user-name">@${user.username}</span><span class="user-id">#${user.id}</span></div></div>`;
}

function userRow(user) {
  const tr = document.createElement("tr");
  tr.dataset.userId = String(user.id);
  tr.innerHTML = `
    <td class="cell-num col-id" data-label="ID">${user.id}</td>
    <td class="col-user" data-label="User">${userCellHtml(user)}</td>
    <td class="col-protos" data-label="Пр.">${formatProtoCell(user)}</td>
    <td class="cell-num col-traffic" data-label="↓">${formatBytes(user.traffic_in_bytes)}</td>
    <td class="cell-num col-traffic" data-label="↑">${formatBytes(user.traffic_out_bytes)}</td>
    <td class="cell-num col-traffic" data-label="Σ">${formatTotalTrafficCellCompact(user)}</td>
    <td class="cell-num col-req" data-label="#req">${user.requests_count}</td>
    <td class="col-status" data-label="Статус">${formatUserStatusCell(user)}</td>
    <td class="col-limits" data-label="Срок">${formatLimitsCompactCell(user)}</td>
    <td class="col-actions" data-label="Действия">${userRowActionsMenuHtml(user)}</td>
  `;
  bindUserRowActions(tr, user);
  return tr;
}

async function updateUser(id, payload) {
  try {
    await api(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setStatus("Пользователь обновлен");
    await loadUsers({ forceFullRender: true });
  } catch (e) {
    setStatus(e.message, true);
  }
}

function renderTrafficSummary(summary) {
  if (!summary) return;
  const all = summary.all_time || {};
  const month = summary.month || {};
  const sinceIso = summary.first_connection_at;
  if (summaryAllTimeIn) summaryAllTimeIn.textContent = formatBytes(all.traffic_in_bytes || 0);
  if (summaryAllTimeOut) summaryAllTimeOut.textContent = formatBytes(all.traffic_out_bytes || 0);
  renderSummaryTotalDd(summaryAllTimeTotal, all.traffic_bytes, sinceIso);
  const since = formatFirstConnectionSince(sinceIso);
  if (summaryFirstConnection) {
    summaryFirstConnection.textContent = since
      ? `С первого подключения к серверу: ${since.dateStr} · ${since.daysStr}`
      : "";
  }
  if (summaryMonthLabel) summaryMonthLabel.textContent = summary.month_label ? `(${summary.month_label})` : "";
  if (summaryMonthIn) summaryMonthIn.textContent = formatBytes(month.traffic_in_bytes || 0);
  if (summaryMonthOut) summaryMonthOut.textContent = formatBytes(month.traffic_out_bytes || 0);
  if (summaryMonthTotal) summaryMonthTotal.textContent = formatBytes(month.traffic_bytes || 0);
}

async function loadTrafficSummary({ silent = false } = {}) {
  try {
    const summary = await api("/api/traffic/summary");
    renderTrafficSummary(summary);
  } catch (e) {
    if (!silent) setStatus(`Ошибка сводки трафика: ${e.message}`, true);
  }
}

function updateConnectionsSortHeaders() {
  const headers = document.querySelectorAll("#connectionsSection th.sortable[data-sort]");
  headers.forEach((th) => {
    const field = th.dataset.sort;
    const indicator = th.querySelector(".sort-indicator");
    const active = field === connectionsSortBy;
    th.classList.toggle("sort-active", active);
    th.setAttribute("aria-sort", active ? (connectionsSortDir === "asc" ? "ascending" : "descending") : "none");
    if (indicator) {
      indicator.textContent = active ? (connectionsSortDir === "asc" ? "↑" : "↓") : "⇅";
    }
  });
}

function initConnectionsTableSort() {
  const headers = document.querySelectorAll("#connectionsSection th.sortable[data-sort]");
  headers.forEach((th) => {
    th.addEventListener("click", () => {
      const field = th.dataset.sort;
      if (!field) return;
      if (connectionsSortBy === field) {
        connectionsSortDir = connectionsSortDir === "asc" ? "desc" : "asc";
      } else {
        connectionsSortBy = field;
        connectionsSortDir = field === "username" || field === "id" ? "asc" : "desc";
      }
      connectionsListPage = 1;
      updateConnectionsSortHeaders();
      loadConnections({ forceFullRender: true });
    });
  });
  updateConnectionsSortHeaders();
}

function updateConnectionsPaginationUi(total, totalPages) {
  if (!connectionsPagination) return;
  if (total <= CONNECTIONS_PAGE_SIZE) {
    connectionsPagination.classList.add("hidden");
    return;
  }
  connectionsPagination.classList.remove("hidden");
  if (connectionsPageInfo) {
    connectionsPageInfo.textContent = `Страница ${connectionsListPage} из ${totalPages} · всего ${total}`;
  }
  if (connectionsPagePrev) connectionsPagePrev.disabled = connectionsListPage <= 1;
  if (connectionsPageNext) connectionsPageNext.disabled = connectionsListPage >= totalPages;
}

function renderConnectionsSummary(totals) {
  if (!totals) return;
  const fmt = (tcp, ips) => `${totals[tcp] || 0} TCP · ${totals[ips] || 0} IP`;
  if (connectionsTotalHttp) {
    connectionsTotalHttp.textContent = fmt("connections_http", "connections_http_ips");
  }
  if (connectionsTotalMtproto) {
    connectionsTotalMtproto.textContent = fmt("connections_mtproto", "connections_mtproto_ips");
  }
  if (connectionsTotalAll) {
    connectionsTotalAll.textContent = fmt("connections_total", "connections_total_ips");
  }
  if (connectionsUsersBadge) {
    connectionsUsersBadge.textContent = `Пользователей с сессиями: ${totals.users_with_connections || 0}`;
  }
}

function connectionRow(user) {
  const tr = document.createElement("tr");
  tr.dataset.userId = String(user.id);
  tr.innerHTML = `
    <td class="cell-num" data-label="ID">${user.id}</td>
    <td data-label="Username">${userCellHtml(user)}</td>
    <td class="cell-num cell-conn" data-label="HTTP">${formatProtocolConnectionsCell(user.connections_http, user.connections_http_ips, user.allow_http)}</td>
    <td class="cell-num cell-conn" data-label="MTProto">${formatProtocolConnectionsCell(user.connections_mtproto, user.connections_mtproto_ips, user.allow_mtproto)}</td>
    <td class="cell-num cell-conn" data-label="Всего">${formatProtocolConnectionsCell(user.connections_total, user.connections_total_ips, true)}</td>
    <td data-label="Онлайн">${onlineStatusPill(user)}</td>
  `;
  return tr;
}

function updateConnectionRowInPlace(tr, user) {
  if (!tr || !user) return;
  const setCell = (label, html) => {
    const td = tr.querySelector(`td[data-label="${label}"]`);
    if (td) td.innerHTML = html;
  };
  setCell("HTTP", formatProtocolConnectionsCell(user.connections_http, user.connections_http_ips, user.allow_http));
  setCell("MTProto", formatProtocolConnectionsCell(user.connections_mtproto, user.connections_mtproto_ips, user.allow_mtproto));
  setCell("Всего", formatProtocolConnectionsCell(user.connections_total, user.connections_total_ips, true));
  setCell("Онлайн", onlineStatusPill(user));
}

function renderConnectionsTable({ forceFullRender = false } = {}) {
  if (!connectionsTableBody) return;
  const total = connectionsTableTotal;
  if (!total) {
    connectionsTableBody.innerHTML = "";
    const tr = document.createElement("tr");
    const q = String(connectionsSearchInput?.value || "").trim();
    tr.innerHTML = `<td colspan="6" class="empty-users">${q ? "Ничего не найдено" : "Пользователей пока нет"}</td>`;
    connectionsTableBody.appendChild(tr);
    if (connectionsPagination) connectionsPagination.classList.add("hidden");
    return;
  }
  const totalPages = Math.max(1, Math.ceil(total / CONNECTIONS_PAGE_SIZE));
  const existingRows = connectionsTableBody.querySelectorAll("tr[data-user-id]");
  const canPatch =
    !forceFullRender &&
    existingRows.length === connectionsCache.length &&
    existingRows.every((row, index) => row.dataset.userId === String(connectionsCache[index]?.id));
  if (canPatch) {
    existingRows.forEach((row, index) => updateConnectionRowInPlace(row, connectionsCache[index]));
  } else {
    connectionsTableBody.innerHTML = "";
    connectionsCache.forEach((u) => connectionsTableBody.appendChild(connectionRow(u)));
  }
  updateConnectionsPaginationUi(total, totalPages);
}

async function loadConnections({ forceFullRender = false, silent = false } = {}) {
  if (connectionsRefreshInFlight) return;
  connectionsRefreshInFlight = true;
  try {
    const q = String(connectionsSearchInput?.value || "").trim();
    for (let guard = 0; guard < 5; guard += 1) {
      const qs = new URLSearchParams({
        page: String(connectionsListPage),
        per_page: String(CONNECTIONS_PAGE_SIZE),
        sort_by: connectionsSortBy,
        sort_dir: connectionsSortDir,
      });
      if (q) qs.set("q", q);
      const pageData = await api(`/api/connections?${qs.toString()}`);
      const total = Number(pageData.total) || 0;
      const perPage = Number(pageData.per_page) || CONNECTIONS_PAGE_SIZE;
      const totalPages = total === 0 ? 1 : Math.max(1, Math.ceil(total / perPage));
      if (connectionsListPage > totalPages) {
        connectionsListPage = totalPages;
        continue;
      }
      connectionsListPage = Number(pageData.page) || connectionsListPage;
      connectionsTableTotal = total;
      connectionsCache = Array.isArray(pageData.items) ? pageData.items : [];
      renderConnectionsSummary(pageData.totals);
      renderConnectionsTable({ forceFullRender });
      break;
    }
  } catch (e) {
    if (!silent) setStatus(`Ошибка загрузки подключений: ${e.message}`, true);
  } finally {
    connectionsRefreshInFlight = false;
  }
}

async function loadUsers({ forceFullRender = false, silent = false } = {}) {
  if (usersRefreshInFlight) return;
  usersRefreshInFlight = true;
  try {
    const q = String(usersSearchInput?.value || "").trim();
    for (let guard = 0; guard < 5; guard += 1) {
      const qs = new URLSearchParams({
        page: String(usersListPage),
        per_page: String(USERS_PAGE_SIZE),
        sort_by: usersSortBy,
        sort_dir: usersSortDir,
      });
      if (q) qs.set("q", q);
      const requests = [api(`/api/users?${qs.toString()}`)];
      if (!silent) {
        requests.push(api("/api/users/chart-options"));
      }
      const results = await Promise.all(requests);
      const pageData = results[0];
      const chartUsers = !silent ? results[1] : null;
      const total = Number(pageData.total) || 0;
      const perPage = Number(pageData.per_page) || USERS_PAGE_SIZE;
      const totalPages = total === 0 ? 1 : Math.max(1, Math.ceil(total / perPage));
      if (usersListPage > totalPages) {
        usersListPage = totalPages;
        continue;
      }
      usersListPage = Number(pageData.page) || usersListPage;
      usersTableTotal = total;
      usersCache = Array.isArray(pageData.items) ? pageData.items : [];
      if (kpiUsersTotal) kpiUsersTotal.textContent = String(total);
      if (navUsersBadge) navUsersBadge.textContent = String(total);
      if (onlineTotalBadge) {
        const onlineTotal = Number(pageData.online_total) || 0;
        onlineTotalBadge.textContent = `Онлайн сейчас: ${onlineTotal}`;
        if (kpiOnlineNow) kpiOnlineNow.textContent = String(onlineTotal);
        if (navOnlineBadge) navOnlineBadge.textContent = String(onlineTotal);
      }
      renderUsersTable({ forceFullRender });
      if (chartUsers) {
        refreshChartUserOptions(chartUsers);
      }
      break;
    }
  } catch (e) {
    if (!silent) setStatus(`Ошибка загрузки: ${e.message}`, true);
  } finally {
    usersRefreshInFlight = false;
  }
}

async function refreshLiveData() {
  if (appContainer.classList.contains("hidden") || document.hidden) return;
  const onUsersTab = !usersSection.classList.contains("hidden");
  const onConnectionsTab = connectionsSection && !connectionsSection.classList.contains("hidden");
  if (onUsersTab) {
    await loadUsers({ silent: true });
  }
  if (onConnectionsTab) {
    await loadConnections({ silent: true });
  }
  const onAnalyticsTab =
    analyticsSection &&
    !analyticsSection.classList.contains("hidden") &&
    trafficSummarySection &&
    !trafficSummarySection.classList.contains("hidden");
  if (onAnalyticsTab) {
    await loadTrafficSummary({ silent: true });
    await loadTrafficChart({ silent: true });
  }
}

function setConnectionsLiveBadgePaused(paused) {
  if (!connectionsLiveBadge) return;
  connectionsLiveBadge.classList.toggle("paused", paused);
  connectionsLiveBadge.title = paused
    ? "Автообновление приостановлено (вкладка неактивна)"
    : "Данные обновляются автоматически каждые 3 секунды";
}

function startLiveRefresh() {
  stopLiveRefresh();
  setLiveBadgePaused(false);
  setConnectionsLiveBadgePaused(false);
  void refreshLiveData();
  liveRefreshTimer = setInterval(() => {
    void refreshLiveData();
  }, LIVE_REFRESH_INTERVAL_MS);
  chartRefreshTimer = setInterval(() => {
    if (appContainer.classList.contains("hidden") || document.hidden) return;
    if (
      analyticsSection &&
      !analyticsSection.classList.contains("hidden") &&
      trafficSummarySection &&
      !trafficSummarySection.classList.contains("hidden")
    ) {
      void loadTrafficSummary({ silent: true });
      void loadTrafficChart({ silent: true });
    }
  }, CHART_REFRESH_INTERVAL_MS);
}

function stopLiveRefresh() {
  if (liveRefreshTimer) {
    clearInterval(liveRefreshTimer);
    liveRefreshTimer = null;
  }
  if (chartRefreshTimer) {
    clearInterval(chartRefreshTimer);
    chartRefreshTimer = null;
  }
}

async function loadMeta() {
  panelMeta = await api("/api/meta");
  if (httpPortLabel) httpPortLabel.textContent = String(panelMeta.proxy_public_http_port ?? 13128);
  if (mtprotoPortLabel) mtprotoPortLabel.textContent = String(panelMeta.proxy_public_mtproto_port ?? 2053);
  if (kpiPorts) {
    const hp = String(panelMeta.proxy_public_http_port ?? 13128);
    const mp = String(panelMeta.proxy_public_mtproto_port ?? 2053);
    kpiPorts.textContent = `${hp} / ${mp}`;
  }
  if (vlessBadge) {
    vlessBadge.classList.remove("ok", "warn");
    if (!panelMeta.vless_active) {
      vlessBadge.classList.add("hidden");
    } else {
      vlessBadge.classList.remove("hidden");
      if (panelMeta.vless_singbox_restart_pending) {
        vlessBadge.classList.add("warn");
        vlessBadge.title = "Автоперезапуск сервисов VLESS не завершился; попробуйте сохранить ссылку ещё раз.";
      } else if (panelMeta.vless_clients_chained) {
        vlessBadge.classList.add("ok");
        vlessBadge.title = "HTTP/SOCKS и MTProto идут через sing-box → VLESS";
      } else {
        vlessBadge.classList.add("warn");
        vlessBadge.title =
          "VLESS в настройках, но цепочка к клиентам отключена: нет vless-out на томе, прога SOCKS не прошла или узел недоступен.";
      }
    }
  }
  if (kpiVlessState && kpiVlessMeta) {
    if (!panelMeta.vless_active) {
      kpiVlessState.textContent = "OFF";
      kpiVlessMeta.textContent = "Цепочка отключена";
    } else if (panelMeta.vless_singbox_restart_pending) {
      kpiVlessState.textContent = "WAIT";
      kpiVlessMeta.textContent = "Ожидается рестарт сервисов";
    } else if (panelMeta.vless_clients_chained) {
      kpiVlessState.textContent = "ON";
      kpiVlessMeta.textContent = "Трафик идет через VLESS";
    } else {
      kpiVlessState.textContent = "WARN";
      kpiVlessMeta.textContent = "Проверка цепочки не пройдена";
    }
  }
  if (navVlessDot) {
    const on = !!panelMeta.vless_active && !!panelMeta.vless_clients_chained;
    navVlessDot.classList.toggle("hidden", !on);
  }
}

async function loadVlessSettings() {
  if (!vlessForm || !vlessEnabled || !vlessLinkInput) return;
  const s = await api("/api/settings/vless");
  vlessEnabled.checked = !!s.vless_enabled;
  vlessLinkInput.value = s.vless_link || "";
  if (vlessFormHint) {
    if (s.vless_singbox_restart_pending) {
      vlessFormHint.textContent =
        "Не удалось автоматически перезапустить сервисы VLESS. Проверьте доступ backend к docker.sock и сохраните ссылку ещё раз.";
      vlessFormHint.className = "hint callout callout-warn";
    } else if (s.vless_clients_chained) {
      vlessFormHint.textContent =
        "Цепочка к клиентам включена: ссылка применена, сервисы автоматически перезапущены.";
      vlessFormHint.className = "hint callout callout-ok";
    } else if (s.vless_active) {
      vlessFormHint.textContent =
        "Ссылка корректна, но цепочка не включена: нет vless-out в /opt/sing-box/config.json на томе, прога SOCKS не прошла или узел VLESS недоступен. Смотрите docker compose logs sing-box.";
      vlessFormHint.className = "hint callout callout-info";
    } else if (s.vless_enabled) {
      vlessFormHint.textContent =
        "Цепочка включена в БД, но ссылка невалидна или конфиг sing-box не VLESS; исправьте vless://.";
      vlessFormHint.className = "hint callout callout-warn";
    } else {
      vlessFormHint.textContent = "";
      vlessFormHint.className = "hint callout callout-neutral is-empty";
    }
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function loadOperators({ silent = false } = {}) {
  if (!operatorsTableBody || authState.is_admin === false) return;
  try {
    const items = await api("/api/operators");
    const list = Array.isArray(items) ? items : [];
    if (navOperatorsBadge) navOperatorsBadge.textContent = String(list.length);
    operatorsTableBody.innerHTML = "";
    if (!list.length) {
      operatorsTableBody.innerHTML =
        '<tr><td colspan="4" class="cell-empty">Пока нет операторов — создайте первого выше</td></tr>';
      return;
    }
    list.forEach((op) => {
      const tr = document.createElement("tr");
      tr.dataset.username = op.username;
      tr.innerHTML = `
        <td data-label="Login"><strong>${escapeHtml(op.username)}</strong></td>
        <td data-label="Template"><code>${escapeHtml(op.username_prefix)}</code>*</td>
        <td data-label="Password"><code class="op-password">${escapeHtml(op.password)}</code></td>
        <td class="col-actions" data-label="Действия">
          <div class="row-actions op-actions">
            <button type="button" class="btn btn-secondary btn-compact" data-op-action="password">Пароль</button>
            <button type="button" class="btn btn-secondary btn-compact" data-op-action="prefix">Шаблон</button>
            <button type="button" class="btn btn-ghost btn-compact" data-op-action="copy">Копировать</button>
            <button type="button" class="btn btn-ghost btn-compact menu-item-danger" data-op-action="delete">Удалить</button>
          </div>
        </td>
      `;
      tr.querySelector('[data-op-action="password"]')?.addEventListener("click", async () => {
        const next = prompt(`Новый пароль для ${op.username} (пусто = сгенерировать):`, "");
        if (next === null) return;
        const password = next.trim() || undefined;
        try {
          const body = password ? { password } : { password: cryptoRandomPassword() };
          const updated = await api(`/api/operators/${encodeURIComponent(op.username)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(password ? { password } : { password: body.password }),
          });
          setStatus(`Пароль ${updated.username} обновлён: ${updated.password}`);
          await loadOperators();
        } catch (e) {
          setStatus(e.message, true);
        }
      });
      tr.querySelector('[data-op-action="prefix"]')?.addEventListener("click", async () => {
        const next = prompt(`Шаблон для ${op.username}:`, op.username_prefix);
        if (next === null) return;
        const username_prefix = next.trim();
        if (!username_prefix) {
          setStatus("Шаблон не может быть пустым", true);
          return;
        }
        try {
          await api(`/api/operators/${encodeURIComponent(op.username)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username_prefix }),
          });
          setStatus(`Шаблон ${op.username} обновлён`);
          await loadOperators();
        } catch (e) {
          setStatus(e.message, true);
        }
      });
      tr.querySelector('[data-op-action="copy"]')?.addEventListener("click", async () => {
        const text = `login: ${op.username}\npassword: ${op.password}\nprefix: ${op.username_prefix}`;
        const ok = await copyToClipboard(text);
        setStatus(ok ? `Данные ${op.username} скопированы` : "Не удалось скопировать", !ok);
      });
      tr.querySelector('[data-op-action="delete"]')?.addEventListener("click", async () => {
        if (!confirm(`Удалить оператора ${op.username}?`)) return;
        try {
          await api(`/api/operators/${encodeURIComponent(op.username)}`, { method: "DELETE" });
          setStatus(`Оператор ${op.username} удалён`);
          await loadOperators();
        } catch (e) {
          setStatus(e.message, true);
        }
      });
      operatorsTableBody.appendChild(tr);
    });
  } catch (e) {
    if (!silent) setStatus(`Ошибка операторов: ${e.message}`, true);
  }
}

function cryptoRandomPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

if (createOperatorForm) {
  createOperatorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(createOperatorForm);
    const payload = {
      username: String(fd.get("username") || "").trim(),
      username_prefix: String(fd.get("username_prefix") || "").trim(),
    };
    const pwd = String(fd.get("password") || "").trim();
    if (pwd) payload.password = pwd;
    if (!payload.username || !payload.username_prefix) {
      setStatus("Укажите логин и шаблон", true);
      return;
    }
    try {
      const created = await api("/api/operators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(`Оператор ${created.username} создан. Пароль: ${created.password}`);
      createOperatorForm.reset();
      await loadOperators();
    } catch (err) {
      setStatus(err.message, true);
    }
  });
}

function refreshChartUserOptions(users) {
  const prev = chartUserSelect.value;
  chartUserSelect.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "Все пользователи";
  chartUserSelect.appendChild(allOption);
  users.forEach((u) => {
    const option = document.createElement("option");
    option.value = String(u.id);
    option.textContent = u.username;
    chartUserSelect.appendChild(option);
  });
  chartUserSelect.value = users.some((u) => String(u.id) === prev) ? prev : "";
}

async function loadTrafficChart({ silent = false } = {}) {
  try {
    const minutes = Number(chartRangeSelect.value || 180);
    const userId = chartUserSelect.value;
    const url = userId
      ? `/api/traffic/samples?user_id=${encodeURIComponent(userId)}&minutes=${minutes}`
      : `/api/traffic/samples?minutes=${minutes}`;
    const points = await api(url);
    if (!Array.isArray(points) || points.length < 2) {
      if (trafficChart) {
        trafficChart.destroy();
        trafficChart = null;
      }
      statIn.textContent = "IN min/max/avg: —";
      statOut.textContent = "OUT min/max/avg: —";
      statTotal.textContent = "TOTAL min/max/avg: —";
      return;
    }

    const labels = [];
    const inData = [];
    const outData = [];
    const totalData = [];
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const curr = points[i];
      const prevTs = new Date(prev.captured_at).getTime();
      const currTs = new Date(curr.captured_at).getTime();
      const dtSec = Math.max(1, Math.round((currTs - prevTs) / 1000));

      const deltaIn = Math.max(0, Number(curr.traffic_in_bytes) - Number(prev.traffic_in_bytes));
      const deltaOut = Math.max(0, Number(curr.traffic_out_bytes) - Number(prev.traffic_out_bytes));
      const deltaTotal = Math.max(0, Number(curr.traffic_bytes) - Number(prev.traffic_bytes));

      labels.push(new Date(curr.captured_at).toLocaleTimeString());
      inData.push(deltaIn / dtSec);
      outData.push(deltaOut / dtSec);
      totalData.push(deltaTotal / dtSec);
    }

    const inStats = metricStats(inData);
    const outStats = metricStats(outData);
    const totalStats = metricStats(totalData);
    statIn.textContent = `IN min/max/avg: ${formatRate(inStats.min)} / ${formatRate(inStats.max)} / ${formatRate(inStats.avg)}`;
    statOut.textContent = `OUT min/max/avg: ${formatRate(outStats.min)} / ${formatRate(outStats.max)} / ${formatRate(outStats.avg)}`;
    statTotal.textContent = `TOTAL min/max/avg: ${formatRate(totalStats.min)} / ${formatRate(totalStats.max)} / ${formatRate(totalStats.avg)}`;

    if (trafficChart) {
      trafficChart.data.labels = labels;
      trafficChart.data.datasets[0].data = inData;
      trafficChart.data.datasets[1].data = outData;
      trafficChart.data.datasets[2].data = totalData;
      trafficChart.update("none");
      return;
    }

    trafficChart = new Chart(trafficChartCanvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Входящий",
          data: inData,
          borderColor: "#8b7dff",
          backgroundColor: "rgba(139,125,255,0.24)",
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 3,
          borderWidth: 2.2,
          tension: 0.28,
        },
        {
          label: "Исходящий",
          data: outData,
          borderColor: "#4ec2ff",
          backgroundColor: "rgba(78,194,255,0.18)",
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 3,
          borderWidth: 2.2,
          tension: 0.26,
        },
        {
          label: "Всего",
          data: totalData,
          borderColor: "#8ee7b5",
          backgroundColor: "rgba(142,231,181,0.12)",
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 3,
          borderWidth: 1.9,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          labels: {
            color: "#d6e3ff",
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            boxHeight: 8,
            padding: 16,
          },
        },
        tooltip: {
          backgroundColor: "rgba(8, 14, 29, 0.94)",
          borderColor: "rgba(143,176,255,0.28)",
          borderWidth: 1,
          titleColor: "#e7efff",
          bodyColor: "#c8d7ff",
          displayColors: true,
          padding: 10,
          cornerRadius: 10,
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(120,150,220,0.1)", drawTicks: false },
          ticks: { color: "#a9bde9", maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
          border: { color: "rgba(143,176,255,0.2)" },
        },
        y: {
          grid: { color: "rgba(120,150,220,0.1)", drawTicks: false },
          ticks: {
            color: "#a9bde9",
            callback(value) {
              return formatRate(Number(value));
            },
          },
          border: { color: "rgba(143,176,255,0.2)" },
          beginAtZero: true,
        },
      },
    },
  });
  } catch (e) {
    if (!silent) setStatus(`Ошибка графика: ${e.message}`, true);
  }
}

function showLoggedInUI() {
  loginOverlay.classList.add("hidden");
  appContainer.classList.remove("hidden");
  loginStatusEl.textContent = "";
}

function showLoggedOutUI() {
  appContainer.classList.add("hidden");
  loginOverlay.classList.remove("hidden");
  authState = { username: "", is_admin: true, username_prefix: null };
  if (authUserLabel) authUserLabel.textContent = "";
  if (brandSubEl && brandSubDefault) brandSubEl.textContent = brandSubDefault;
  document.querySelectorAll(".admin-only").forEach((el) => el.classList.remove("hidden"));
  if (vlessTabBtn) vlessTabBtn.classList.remove("hidden");
}

async function loadAuthMe() {
  authState = await api("/api/auth/me");
  applyAuthScopeUI();
  return authState;
}

function applyAuthScopeUI() {
  const isAdmin = authState.is_admin !== false;
  const prefix = authState.username_prefix || "";
  document.querySelectorAll(".admin-only").forEach((el) => {
    el.classList.toggle("hidden", !isAdmin);
  });
  if (vlessTabBtn) {
    vlessTabBtn.classList.toggle("hidden", !isAdmin);
    if (!isAdmin && vlessTabBtn.classList.contains("tab-active")) {
      showUsersTab();
    }
  }
  if (operatorsTabBtn) {
    operatorsTabBtn.classList.toggle("hidden", !isAdmin);
    if (!isAdmin && operatorsTabBtn.classList.contains("tab-active")) {
      showUsersTab();
    }
  }
  if (analyticsTabBtn) {
    analyticsTabBtn.classList.toggle("hidden", !isAdmin);
    if (!isAdmin && analyticsTabBtn.classList.contains("tab-active")) {
      showUsersTab();
    }
  }
  if (authUserLabel) {
    authUserLabel.textContent = authState.username || "Admin";
  }
  if (brandSubEl) {
    brandSubEl.textContent = prefix
      ? `Доступ только к шаблону ${prefix}*`
      : brandSubDefault || "Список, трафик и действия по прокси-аккаунтам";
  }
  prefillsScopedUsername();
  if (isAdmin) {
    void loadOperators({ silent: true });
  }
}

function prefillsScopedUsername() {
  const usernameInput = createUsernameInput || createForm?.querySelector('input[name="username"]');
  const prefix = authState.username_prefix || "";
  if (usernamePrefixAddon) {
    if (prefix) {
      usernamePrefixAddon.textContent = prefix;
      usernamePrefixAddon.classList.remove("hidden");
    } else {
      usernamePrefixAddon.textContent = "";
      usernamePrefixAddon.classList.add("hidden");
    }
  }
  if (!usernameInput) return;
  if (!prefix) {
    usernameInput.placeholder = "username";
    usernameInput.minLength = 3;
    usernameInput.maxLength = 64;
    return;
  }
  // Operator enters only the suffix; template prefix is locked in the addon.
  usernameInput.placeholder = "Иванов_И.";
  usernameInput.minLength = 1;
  usernameInput.maxLength = Math.max(1, 64 - prefix.length);
  if (usernameInput.value.startsWith(prefix)) {
    usernameInput.value = usernameInput.value.slice(prefix.length);
  }
}

function buildScopedUsername(rawUsername) {
  const prefix = authState.username_prefix || "";
  let name = String(rawUsername || "").trim();
  if (!prefix) return name;
  if (name.startsWith(prefix)) return name;
  name = name.replace(/^_+/, "");
  return `${prefix}${name}`;
}

function assertScopedUsername(username) {
  const prefix = authState.username_prefix || "";
  const finalName = buildScopedUsername(username);
  if (prefix && !finalName.startsWith(prefix)) {
    throw new Error(`Логин должен начинаться с ${prefix}`);
  }
  if (!finalName || finalName.length < 3) {
    throw new Error("Логин слишком короткий");
  }
  if (finalName.length > 64) {
    throw new Error("Логин слишком длинный");
  }
  if (prefix && finalName === prefix) {
    throw new Error(`Укажите имя после шаблона ${prefix}`);
  }
  return finalName;
}

function syncMtprotoAdFormVisibility() {
  if (!allowMtprotoCheckbox || !mtprotoAdBlock) return;
  const mtOn = allowMtprotoCheckbox.checked;
  mtprotoAdBlock.classList.toggle("hidden", !mtOn);
  if (!mtOn && mtprotoAdEnabledCheckbox) {
    mtprotoAdEnabledCheckbox.checked = false;
  }
  if (mtprotoAdFields && mtprotoAdEnabledCheckbox) {
    mtprotoAdFields.classList.toggle("hidden", !mtOn || !mtprotoAdEnabledCheckbox.checked);
  }
}

if (allowMtprotoCheckbox) {
  allowMtprotoCheckbox.addEventListener("change", syncMtprotoAdFormVisibility);
}
if (mtprotoAdEnabledCheckbox) {
  mtprotoAdEnabledCheckbox.addEventListener("change", syncMtprotoAdFormVisibility);
}

createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(createForm);
  const pwdRaw = String(formData.get("password") || "").trim();
  const payload = {
    username: String(formData.get("username") || "").trim(),
    allow_http: formData.get("allow_http") === "on",
    allow_mtproto: formData.get("allow_mtproto") === "on",
    mtproto_ad_enabled: formData.get("mtproto_ad_enabled") === "on",
  };
  try {
    payload.username = assertScopedUsername(payload.username);
  } catch (scopeErr) {
    setStatus(scopeErr.message, true);
    return;
  }
  if (payload.mtproto_ad_enabled) {
    const channel = String(formData.get("mtproto_ad_channel") || "").trim();
    const adTag = String(formData.get("mtproto_ad_tag") || "").trim();
    if (!channel) {
      setStatus("Укажите ссылку на канал или группу для рекламы", true);
      return;
    }
    payload.mtproto_ad_channel = channel;
    if (adTag) {
      payload.mtproto_ad_tag = adTag.toLowerCase();
    }
  }
  if (pwdRaw) {
    payload.password = pwdRaw;
  }
  const expRaw = String(formData.get("expires_at") || "").trim();
  if (expRaw) {
    payload.expires_at = new Date(expRaw).toISOString();
  }
  const gbRaw = String(formData.get("traffic_limit_gb") || "").trim();
  if (gbRaw) {
    const gb = parseFloat(gbRaw);
    if (!Number.isNaN(gb) && gb > 0) {
      payload.traffic_limit_bytes = Math.round(gb * 1024 * 1024 * 1024);
    }
  }
  try {
    const created = await api("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (created.password_generated) {
      setStatus(`Пользователь ${created.username} создан. Пароль: ${created.password} (скопируйте сейчас)`);
    } else {
      setStatus(`Пользователь ${payload.username} создан`);
    }
    createForm.reset();
    createForm.querySelector('input[name="allow_http"]').checked = true;
    createForm.querySelector('input[name="allow_mtproto"]').checked = false;
    prefillsScopedUsername();
    syncMtprotoAdFormVisibility();
    await loadUsers({ forceFullRender: true });
    await loadTrafficChart();
  } catch (err) {
    setStatus(err.message, true);
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await api("/api/auth/logout", { method: "POST" });
  } catch (_e) {}
  stopLiveRefresh();
  showLoggedOutUI();
  setStatus("");
});

importTemplateBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/users/import-template", { method: "GET", credentials: "same-origin" });
    if (!response.ok) {
      let detail = `HTTP ${response.status}`;
      try {
        const data = await response.json();
        detail = data.detail || detail;
      } catch (_e) {}
      throw new Error(detail);
    }
    const blob = await response.blob();
    const cd = response.headers.get("content-disposition") || "";
    const nameMatch = /filename="?([^"]+)"?/.exec(cd);
    const filename = nameMatch ? nameMatch[1] : "proxy-users-import-template.csv";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Шаблон CSV скачан");
    closeArchiveMenu();
  } catch (err) {
    setStatus(`Ошибка шаблона: ${err.message}`, true);
  }
});

importUsersInput.addEventListener("change", async () => {
  const file = importUsersInput.files?.[0];
  if (!file) return;
  const fd = new FormData();
  fd.append("file", file);
  try {
    const response = await fetch("/api/users/import", { method: "POST", body: fd, credentials: "same-origin" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || `HTTP ${response.status}`);
    }
    const n = data.created ?? 0;
    const errs = data.errors || [];
    let msg = `Импорт: создано ${n}`;
    if (errs.length) {
      msg += `, ошибок ${errs.length}`;
      const sample = errs
        .slice(0, 5)
        .map((e) => `стр.${e.row}: ${e.detail}`)
        .join("; ");
      msg += `. ${sample}`;
      if (errs.length > 5) msg += " …";
    }
    setStatus(msg, errs.length > 0 && n === 0);
    await loadUsers({ forceFullRender: true });
    await loadTrafficChart();
    closeArchiveMenu();
  } catch (err) {
    setStatus(`Ошибка импорта: ${err.message}`, true);
  } finally {
    importUsersInput.value = "";
  }
});

reportLinksBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/users/report-links", { method: "GET", credentials: "same-origin" });
    if (!response.ok) {
      let detail = `HTTP ${response.status}`;
      try {
        const data = await response.json();
        detail = data.detail || detail;
      } catch (_e) {}
      throw new Error(detail);
    }
    const blob = await response.blob();
    const cd = response.headers.get("content-disposition") || "";
    const nameMatch = /filename="?([^"]+)"?/.exec(cd);
    const filename = nameMatch ? nameMatch[1] : "proxy-users-report-links.csv";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Отчёт со ссылками выгружен");
    closeArchiveMenu();
  } catch (err) {
    setStatus(`Ошибка отчёта: ${err.message}`, true);
  }
});

reportUsersBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/users/report", { method: "GET", credentials: "same-origin" });
    if (!response.ok) {
      let detail = `HTTP ${response.status}`;
      try {
        const data = await response.json();
        detail = data.detail || detail;
      } catch (_e) {}
      throw new Error(detail);
    }
    const blob = await response.blob();
    const cd = response.headers.get("content-disposition") || "";
    const nameMatch = /filename="?([^"]+)"?/.exec(cd);
    const filename = nameMatch ? nameMatch[1] : "proxy-users-report.csv";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Отчёт выгружен");
    closeArchiveMenu();
  } catch (err) {
    setStatus(`Ошибка отчёта: ${err.message}`, true);
  }
});

backupBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/backup", { method: "POST" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const blob = await response.blob();
    const cd = response.headers.get("content-disposition") || "";
    const nameMatch = /filename="?([^"]+)"?/.exec(cd);
    const filename = nameMatch ? nameMatch[1] : "panel-backup.db";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Backup успешно выгружен");
    closeArchiveMenu();
  } catch (err) {
    setStatus(`Ошибка backup: ${err.message}`, true);
  }
});

restoreInput.addEventListener("change", async () => {
  const file = restoreInput.files?.[0];
  if (!file) return;
  const fd = new FormData();
  fd.append("file", file);
  try {
    const restored = await api("/api/restore", { method: "POST", body: fd });
    const fmt = restored.format ? String(restored.format) : "";
    setStatus(fmt ? `Восстановление выполнено (${fmt})` : "Восстановление выполнено");
    await loadUsers({ forceFullRender: true });
    closeArchiveMenu();
  } catch (err) {
    setStatus(`Ошибка восстановления: ${err.message}`, true);
  } finally {
    restoreInput.value = "";
  }
});

archiveMenuBtn.addEventListener("click", () => {
  archiveMenu.classList.toggle("hidden");
});
usersTabBtn.addEventListener("click", showUsersTab);
vlessTabBtn.addEventListener("click", async () => {
  showVlessTab();
  try {
    await loadVlessSettings();
    await loadMeta();
  } catch (e) {
    setStatus(`Ошибка VLESS: ${e.message}`, true);
  }
});
if (operatorsTabBtn) {
  operatorsTabBtn.addEventListener("click", async () => {
    showOperatorsTab();
    try {
      await loadOperators();
    } catch (e) {
      setStatus(`Ошибка операторов: ${e.message}`, true);
    }
  });
}
analyticsTabBtn.addEventListener("click", async () => {
  showAnalyticsTab();
  try {
    await Promise.all([loadTrafficSummary(), loadTrafficChart()]);
  } catch (e) {
    setStatus(`Ошибка загрузки трафика: ${e.message}`, true);
  }
});
connectionsTabBtn.addEventListener("click", async () => {
  showConnectionsTab();
  try {
    await loadConnections({ forceFullRender: true });
  } catch (e) {
    setStatus(`Ошибка загрузки подключений: ${e.message}`, true);
  }
});
chartRefreshBtn.addEventListener("click", async () => {
  try {
    if (trafficChart) {
      trafficChart.destroy();
      trafficChart = null;
    }
    await loadTrafficChart();
  } catch (e) {
    setStatus(`Ошибка графика: ${e.message}`, true);
  }
});
chartUserSelect.addEventListener("change", async () => {
  try {
    if (trafficChart) {
      trafficChart.destroy();
      trafficChart = null;
    }
    await loadTrafficChart();
  } catch (e) {
    setStatus(`Ошибка графика: ${e.message}`, true);
  }
});
chartRangeSelect.addEventListener("change", async () => {
  try {
    if (trafficChart) {
      trafficChart.destroy();
      trafficChart = null;
    }
    await loadTrafficChart();
  } catch (e) {
    setStatus(`Ошибка графика: ${e.message}`, true);
  }
});
if (usersSearchInput) {
  usersSearchInput.addEventListener("input", () => {
    usersListPage = 1;
    if (usersSearchDebounce) clearTimeout(usersSearchDebounce);
    usersSearchDebounce = setTimeout(() => {
      usersSearchDebounce = null;
      loadUsers({ forceFullRender: true });
    }, 300);
  });
}

if (usersPagePrev) {
  usersPagePrev.addEventListener("click", () => {
    if (usersListPage > 1) {
      usersListPage -= 1;
      loadUsers({ forceFullRender: true });
    }
  });
}
if (usersPageNext) {
  usersPageNext.addEventListener("click", () => {
    const totalPages = usersTableTotal === 0 ? 1 : Math.max(1, Math.ceil(usersTableTotal / USERS_PAGE_SIZE));
    if (usersListPage < totalPages) {
      usersListPage += 1;
      loadUsers({ forceFullRender: true });
    }
  });
}

if (connectionsSearchInput) {
  connectionsSearchInput.addEventListener("input", () => {
    connectionsListPage = 1;
    if (connectionsSearchDebounce) clearTimeout(connectionsSearchDebounce);
    connectionsSearchDebounce = setTimeout(() => {
      connectionsSearchDebounce = null;
      loadConnections({ forceFullRender: true });
    }, 300);
  });
}
if (connectionsPagePrev) {
  connectionsPagePrev.addEventListener("click", () => {
    if (connectionsListPage > 1) {
      connectionsListPage -= 1;
      loadConnections({ forceFullRender: true });
    }
  });
}
if (connectionsPageNext) {
  connectionsPageNext.addEventListener("click", () => {
    const totalPages =
      connectionsTableTotal === 0 ? 1 : Math.max(1, Math.ceil(connectionsTableTotal / CONNECTIONS_PAGE_SIZE));
    if (connectionsListPage < totalPages) {
      connectionsListPage += 1;
      loadConnections({ forceFullRender: true });
    }
  });
}

initUsersTableSort();
initConnectionsTableSort();

if (vlessForm) {
  vlessForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      vless_enabled: vlessEnabled.checked,
      vless_link: (vlessLinkInput.value || "").trim() || null,
    };
    try {
      await api("/api/settings/vless", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setStatus("Настройки VLESS сохранены. Сервисы цепочки автоматически перезапускаются.");
      await loadMeta();
      await loadVlessSettings();
    } catch (err) {
      setStatus(err.message, true);
    }
  });
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const payload = {
    username: String(formData.get("username") || "").trim(),
    password: String(formData.get("password") || ""),
  };
  try {
    await api("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await loadAuthMe();
    showLoggedInUI();
    await loadMeta();
    if (authState.is_admin !== false) {
      await loadVlessSettings();
    }
    await loadUsers({ forceFullRender: true });
    startLiveRefresh();
    setStatus("Вы успешно вошли");
  } catch (e1) {
    loginStatusEl.textContent = `Ошибка входа: ${e1.message}`;
  }
});

async function bootstrap() {
  try {
    await loadAuthMe();
    showLoggedInUI();
    showUsersTab();
    await loadMeta();
    if (authState.is_admin !== false) {
      await loadVlessSettings();
    }
    await loadUsers({ forceFullRender: true });
    if (authState.is_admin !== false) {
      await loadTrafficChart();
    }
    startLiveRefresh();
  } catch (_e) {
    showLoggedOutUI();
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    setLiveBadgePaused(true);
    setConnectionsLiveBadgePaused(true);
    return;
  }
  setLiveBadgePaused(false);
  setConnectionsLiveBadgePaused(false);
  void refreshLiveData();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "k" && event.key !== "K") return;
  if (!(event.metaKey || event.ctrlKey)) return;
  if (appContainer.classList.contains("hidden")) return;
  const tag = (event.target && event.target.tagName) || "";
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  event.preventDefault();
  if (usersSearchInput && !usersTableSection.classList.contains("hidden")) {
    usersSearchInput.focus();
    usersSearchInput.select();
  } else if (connectionsSearchInput && connectionsSection && !connectionsSection.classList.contains("hidden")) {
    connectionsSearchInput.focus();
    connectionsSearchInput.select();
  }
});

bootstrap();

copyHttpCredsBtn.addEventListener("click", async () => {
  if (!currentHttpCredsText) return;
  const copied = await copyToClipboard(currentHttpCredsText);
  if (copied) {
    setStatus("HTTP данные скопированы");
  } else {
    setStatus("Не удалось скопировать, скопируйте вручную", true);
  }
});

closeHttpCredsBtn.addEventListener("click", closeHttpCredsModal);

limitsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = limitsUserId.value;
  if (!id) return;
  const expRaw = limitsExpiresInput.value.trim();
  const gbRaw = limitsGbInput.value.trim();
  const body = {
    expires_at: expRaw ? new Date(expRaw).toISOString() : null,
    traffic_limit_bytes: null,
  };
  if (gbRaw) {
    const gb = parseFloat(gbRaw);
    if (!Number.isNaN(gb) && gb > 0) {
      body.traffic_limit_bytes = Math.round(gb * 1024 * 1024 * 1024);
    }
  }
  try {
    await api(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setStatus("Срок и лимит сохранены");
    closeLimitsModal();
    await loadUsers({ forceFullRender: true });
  } catch (err) {
    setStatus(err.message, true);
  }
});

closeLimitsBtn.addEventListener("click", closeLimitsModal);

limitsModal.addEventListener("click", (event) => {
  if (event.target === limitsModal) {
    closeLimitsModal();
  }
});

if (editAllowMtproto) {
  editAllowMtproto.addEventListener("change", syncMtprotoEditModalVisibility);
}
if (editMtprotoAdEnabled) {
  editMtprotoAdEnabled.addEventListener("change", syncMtprotoEditModalVisibility);
}

if (mtprotoForm) {
  mtprotoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = mtprotoUserId?.value;
    if (!id) return;
    const allowMt = editAllowMtproto?.checked === true;
    const payload = { allow_mtproto: allowMt };
    if (editRegenerateMtprotoSecret?.checked) {
      payload.regenerate_mtproto_secret = true;
    }
    const adOn = editMtprotoAdEnabled?.checked === true;
    payload.mtproto_ad_enabled = adOn;
    if (adOn) {
      const channel = String(editMtprotoAdChannel?.value || "").trim();
      if (!channel) {
        setStatus("Укажите ссылку на канал для рекламы", true);
        return;
      }
      payload.mtproto_ad_channel = channel;
      const tag = String(editMtprotoAdTag?.value || "").trim();
      payload.mtproto_ad_tag = tag ? tag.toLowerCase() : null;
    }
    try {
      await api(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus("Настройки MTProto сохранены");
      closeMtprotoModal();
      await loadUsers({ forceFullRender: true });
    } catch (err) {
      setStatus(err.message, true);
    }
  });
}

if (copyMtprotoBotHexBtn) {
  copyMtprotoBotHexBtn.addEventListener("click", async () => {
    if (!currentMtprotoBotHex) {
      setStatus("Нет секрета для бота: включите MTProto или сгенерируйте новый секрет", true);
      return;
    }
    const copied = await copyToClipboard(currentMtprotoBotHex);
    if (copied) {
      setStatus("32 hex для @MTProxybot скопированы");
    } else {
      setStatus(`Скопируйте вручную: ${currentMtprotoBotHex}`, true);
    }
  });
}

if (closeMtprotoBtn) {
  closeMtprotoBtn.addEventListener("click", closeMtprotoModal);
}

if (mtprotoModal) {
  mtprotoModal.addEventListener("click", (event) => {
    if (event.target === mtprotoModal) {
      closeMtprotoModal();
    }
  });
}

httpCredsModal.addEventListener("click", (event) => {
  if (event.target === httpCredsModal) {
    closeHttpCredsModal();
  }
});

document.addEventListener("click", (event) => {
  if (!archiveMenu.contains(event.target) && event.target !== archiveMenuBtn) {
    closeArchiveMenu();
  }
  if (!event.target.closest(".row-actions-menu") && !event.target.closest(".row-menu.is-open")) {
    closeAllRowMenus();
  }
});

window.addEventListener("resize", () => closeAllRowMenus());
window.addEventListener(
  "scroll",
  () => {
    if (document.querySelector(".row-menu.is-open")) closeAllRowMenus();
  },
  true
);
