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
const analyticsTabBtn = document.getElementById("analyticsTabBtn");
const usersSection = document.getElementById("usersSection");
const trafficSummarySection = document.getElementById("trafficSummarySection");
const usersTableSection = document.getElementById("usersTableSection");
const summaryAllTimeIn = document.getElementById("summaryAllTimeIn");
const summaryAllTimeOut = document.getElementById("summaryAllTimeOut");
const summaryAllTimeTotal = document.getElementById("summaryAllTimeTotal");
const summaryMonthLabel = document.getElementById("summaryMonthLabel");
const summaryMonthIn = document.getElementById("summaryMonthIn");
const summaryMonthOut = document.getElementById("summaryMonthOut");
const summaryMonthTotal = document.getElementById("summaryMonthTotal");
const summaryFirstConnection = document.getElementById("summaryFirstConnection");
const vlessSection = document.getElementById("vlessSection");
const analyticsSection = document.getElementById("analyticsSection");
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
const tgHostLabel = document.getElementById("tgHostLabel");
const httpPortLabel = document.getElementById("httpPortLabel");
const socksPortLabel = document.getElementById("socksPortLabel");
const mtprotoPortLabel = document.getElementById("mtprotoPortLabel");
const vlessBadge = document.getElementById("vlessBadge");
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
  proxy_public_socks_port: 11080,
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
const USERS_REFRESH_INTERVAL_MS = 5000;
let usersRefreshInFlight = false;
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
      loadUsers();
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

function renderUsersTable() {
  const total = usersTableTotal;
  usersBody.innerHTML = "";
  if (!total) {
    const tr = document.createElement("tr");
    const q = String(usersSearchInput?.value || "").trim();
    tr.innerHTML = `<td colspan="13" class="empty-users">${q ? "Ничего не найдено" : "Пользователей пока нет"}</td>`;
    usersBody.appendChild(tr);
    if (usersPagination) usersPagination.classList.add("hidden");
    return;
  }
  const totalPages = Math.max(1, Math.ceil(total / USERS_PAGE_SIZE));
  usersCache.forEach((u) => usersBody.appendChild(userRow(u)));
  updateUsersPaginationUi(total, totalPages);
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

function showUsersTab() {
  usersSection.classList.remove("hidden");
  if (trafficSummarySection) trafficSummarySection.classList.remove("hidden");
  usersTableSection.classList.remove("hidden");
  vlessSection.classList.add("hidden");
  analyticsSection.classList.add("hidden");
  usersTabBtn.classList.add("tab-active");
  usersTabBtn.setAttribute("aria-selected", "true");
  vlessTabBtn.classList.remove("tab-active");
  vlessTabBtn.setAttribute("aria-selected", "false");
  analyticsTabBtn.classList.remove("tab-active");
  analyticsTabBtn.setAttribute("aria-selected", "false");
}

function showVlessTab() {
  usersSection.classList.add("hidden");
  if (trafficSummarySection) trafficSummarySection.classList.add("hidden");
  usersTableSection.classList.add("hidden");
  vlessSection.classList.remove("hidden");
  analyticsSection.classList.add("hidden");
  usersTabBtn.classList.remove("tab-active");
  usersTabBtn.setAttribute("aria-selected", "false");
  vlessTabBtn.classList.add("tab-active");
  vlessTabBtn.setAttribute("aria-selected", "true");
  analyticsTabBtn.classList.remove("tab-active");
  analyticsTabBtn.setAttribute("aria-selected", "false");
}

function showAnalyticsTab() {
  usersSection.classList.add("hidden");
  if (trafficSummarySection) trafficSummarySection.classList.add("hidden");
  usersTableSection.classList.add("hidden");
  vlessSection.classList.add("hidden");
  analyticsSection.classList.remove("hidden");
  analyticsTabBtn.classList.add("tab-active");
  analyticsTabBtn.setAttribute("aria-selected", "true");
  usersTabBtn.classList.remove("tab-active");
  usersTabBtn.setAttribute("aria-selected", "false");
  vlessTabBtn.classList.remove("tab-active");
  vlessTabBtn.setAttribute("aria-selected", "false");
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

function userRow(user) {
  const tr = document.createElement("tr");
  const tgLink = `tg://socks?server=${encodeURIComponent(panelMeta.proxy_public_host)}&port=${encodeURIComponent(String(panelMeta.proxy_public_socks_port))}&user=${encodeURIComponent(user.username)}&pass=${encodeURIComponent(user.password || "")}`;
  const mtprotoLink = `tg://proxy?server=${encodeURIComponent(panelMeta.proxy_public_mtproto_host || panelMeta.proxy_public_host)}&port=${encodeURIComponent(String(panelMeta.proxy_public_mtproto_port || 14443))}&secret=${encodeURIComponent(user.mtproto_secret || "")}`;
  const accessOk = user.access_allowed !== false;
  tr.innerHTML = `
    <td class="cell-num" data-label="ID">${user.id}</td>
    <td data-label="Username"><strong>${user.username}</strong></td>
    <td data-label="HTTP">${user.allow_http ? '<span class="cell-yes">Да</span>' : '<span class="cell-no">—</span>'}</td>
    <td data-label="SOCKS5">${user.allow_socks5 ? '<span class="cell-yes">Да</span>' : '<span class="cell-no">—</span>'}</td>
    <td data-label="MTProto">${user.allow_mtproto ? (user.mtproto_ad_enabled ? '<span class="cell-yes" title="Реклама вкл.">MTProto+</span>' : '<span class="cell-yes">Да</span>') : '<span class="cell-no">—</span>'}</td>
    <td class="cell-num" data-label="Входящий">${formatBytes(user.traffic_in_bytes)}</td>
    <td class="cell-num" data-label="Исходящий">${formatBytes(user.traffic_out_bytes)}</td>
    <td class="cell-num cell-total-traffic" data-label="Всего">${formatTotalTrafficCell(user)}</td>
    <td class="cell-num" data-label="Запросов">${user.requests_count}</td>
    <td data-label="До">${formatExpiresCell(user)}</td>
    <td data-label="Лимит">${formatLimitCell(user)}</td>
    <td data-label="Статус">${accessStatusPill(user)}</td>
    <td data-label="Действия">
      <div class="row-actions">
        <button class="btn btn-compact" data-action="toggle-http">${user.allow_http ? "HTTP off" : "HTTP on"}</button>
        <button class="btn btn-compact" data-action="toggle-socks">${user.allow_socks5 ? "SOCKS off" : "SOCKS on"}</button>
        <button class="btn btn-compact" data-action="toggle-mtproto">${user.allow_mtproto ? "MTProto off" : "MTProto on"}</button>
        <button class="btn btn-compact" data-action="limits">Срок / лимит</button>
        <button class="btn btn-compact" data-action="edit-mtproto">MTProto…</button>
        <button class="btn btn-compact" data-action="http-creds">HTTP</button>
        <button class="btn btn-copy btn-compact" data-action="copy-socks">TG SOCKS5</button>
        <button class="btn btn-copy btn-compact" data-action="copy-mtproto">TG MTProto</button>
        <button class="btn btn-danger btn-compact" data-action="delete">Удалить</button>
      </div>
    </td>
  `;

  tr.querySelector('[data-action="toggle-http"]').addEventListener("click", async () => {
    await updateUser(user.id, { allow_http: !user.allow_http });
  });
  tr.querySelector('[data-action="toggle-socks"]').addEventListener("click", async () => {
    await updateUser(user.id, { allow_socks5: !user.allow_socks5 });
  });
  tr.querySelector('[data-action="toggle-mtproto"]').addEventListener("click", async () => {
    await updateUser(user.id, { allow_mtproto: !user.allow_mtproto });
  });
  tr.querySelector('[data-action="limits"]').addEventListener("click", () => {
    openLimitsModal(user);
  });
  tr.querySelector('[data-action="edit-mtproto"]').addEventListener("click", () => {
    openMtprotoModal(user);
  });
  tr.querySelector('[data-action="delete"]').addEventListener("click", async () => {
    if (!confirm(`Удалить пользователя ${user.username}?`)) return;
    try {
      await api(`/api/users/${user.id}`, { method: "DELETE" });
      setStatus(`Пользователь ${user.username} удален`);
      await loadUsers();
    } catch (e) {
      setStatus(e.message, true);
    }
  });
  tr.querySelector('[data-action="copy-socks"]').addEventListener("click", async () => {
    if (!accessOk) {
      setStatus("Доступ заблокирован (срок или лимит трафика)", true);
      return;
    }
    if (!user.allow_socks5) {
      setStatus("У пользователя выключен SOCKS5", true);
      return;
    }
    const copied = await copyToClipboard(tgLink);
    if (copied) {
      setStatus(`SOCKS5 ссылка скопирована для ${user.username}`);
    } else {
      setStatus(`Скопируйте вручную: ${tgLink}`, true);
    }
  });
  tr.querySelector('[data-action="copy-mtproto"]').addEventListener("click", async () => {
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
  tr.querySelector('[data-action="http-creds"]').addEventListener("click", () => {
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
    await loadUsers();
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

async function loadTrafficSummary() {
  try {
    const summary = await api("/api/traffic/summary");
    renderTrafficSummary(summary);
  } catch (e) {
    setStatus(`Ошибка сводки трафика: ${e.message}`, true);
  }
}

async function loadUsers() {
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
      const [pageData, chartUsers] = await Promise.all([
        api(`/api/users?${qs.toString()}`),
        api("/api/users/chart-options"),
        loadTrafficSummary(),
      ]);
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
      renderUsersTable();
      refreshChartUserOptions(chartUsers);
      break;
    }
  } catch (e) {
    setStatus(`Ошибка загрузки: ${e.message}`, true);
  } finally {
    usersRefreshInFlight = false;
  }
}

async function loadMeta() {
  panelMeta = await api("/api/meta");
  if (httpPortLabel) httpPortLabel.textContent = String(panelMeta.proxy_public_http_port ?? 13128);
  if (socksPortLabel) socksPortLabel.textContent = String(panelMeta.proxy_public_socks_port ?? 11080);
  if (mtprotoPortLabel) mtprotoPortLabel.textContent = String(panelMeta.proxy_public_mtproto_port ?? 2053);
  if (tgHostLabel) tgHostLabel.textContent = `${panelMeta.proxy_public_host}:${panelMeta.proxy_public_socks_port}`;
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

async function loadTrafficChart() {
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

  // Zabbix-like view: draw utilization rate (delta per second), not absolute counters.
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
    trafficChart.destroy();
  }
  trafficChart = new Chart(trafficChartCanvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Входящий",
          data: inData,
          borderColor: "#4f7cff",
          backgroundColor: "rgba(79,124,255,0.18)",
          fill: true,
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.18,
        },
        {
          label: "Исходящий",
          data: outData,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.14)",
          fill: true,
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.18,
        },
        {
          label: "Всего",
          data: totalData,
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245,158,11,0.12)",
          fill: false,
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.1,
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
          labels: { color: "#cfe0ff" },
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(120,150,220,0.12)" },
          ticks: { color: "#a9bde9", maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
        },
        y: {
          grid: { color: "rgba(120,150,220,0.12)" },
          ticks: {
            color: "#a9bde9",
            callback(value) {
              return formatRate(Number(value));
            },
          },
          beginAtZero: true,
        },
      },
    },
  });
}

function showLoggedInUI() {
  loginOverlay.classList.add("hidden");
  appContainer.classList.remove("hidden");
  loginStatusEl.textContent = "";
}

function showLoggedOutUI() {
  appContainer.classList.add("hidden");
  loginOverlay.classList.remove("hidden");
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
    allow_socks5: formData.get("allow_socks5") === "on",
    allow_mtproto: formData.get("allow_mtproto") === "on",
    mtproto_ad_enabled: formData.get("mtproto_ad_enabled") === "on",
  };
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
    createForm.querySelector('input[name="allow_socks5"]').checked = true;
    createForm.querySelector('input[name="allow_mtproto"]').checked = false;
    syncMtprotoAdFormVisibility();
    await loadUsers();
    await loadTrafficChart();
  } catch (err) {
    setStatus(err.message, true);
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await api("/api/auth/logout", { method: "POST" });
  } catch (_e) {}
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
    await loadUsers();
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
    await loadUsers();
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
analyticsTabBtn.addEventListener("click", async () => {
  showAnalyticsTab();
  try {
    await loadTrafficChart();
  } catch (e) {
    setStatus(`Ошибка графика: ${e.message}`, true);
  }
});
chartRefreshBtn.addEventListener("click", async () => {
  try {
    await loadTrafficChart();
  } catch (e) {
    setStatus(`Ошибка графика: ${e.message}`, true);
  }
});
chartUserSelect.addEventListener("change", async () => {
  try {
    await loadTrafficChart();
  } catch (e) {
    setStatus(`Ошибка графика: ${e.message}`, true);
  }
});
chartRangeSelect.addEventListener("change", async () => {
  try {
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
      loadUsers();
    }, 300);
  });
}

if (usersPagePrev) {
  usersPagePrev.addEventListener("click", () => {
    if (usersListPage > 1) {
      usersListPage -= 1;
      loadUsers();
    }
  });
}
if (usersPageNext) {
  usersPageNext.addEventListener("click", () => {
    const totalPages = usersTableTotal === 0 ? 1 : Math.max(1, Math.ceil(usersTableTotal / USERS_PAGE_SIZE));
    if (usersListPage < totalPages) {
      usersListPage += 1;
      loadUsers();
    }
  });
}

initUsersTableSort();

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
    showLoggedInUI();
    await loadMeta();
    await loadVlessSettings();
    await loadUsers();
    setStatus("Вы успешно вошли");
  } catch (e1) {
    loginStatusEl.textContent = `Ошибка входа: ${e1.message}`;
  }
});

async function bootstrap() {
  try {
    await api("/api/auth/me");
    showLoggedInUI();
    showUsersTab();
    await loadMeta();
    await loadVlessSettings();
    await loadUsers();
    await loadTrafficChart();
  } catch (_e) {
    showLoggedOutUI();
  }
  setInterval(async () => {
    if (!appContainer.classList.contains("hidden") && !document.hidden) {
      await loadUsers();
      if (!analyticsSection.classList.contains("hidden")) {
        await loadTrafficChart();
      }
    }
  }, USERS_REFRESH_INTERVAL_MS);
}

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
    await loadUsers();
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
      await loadUsers();
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
});
