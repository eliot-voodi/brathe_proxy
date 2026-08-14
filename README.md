# Proxy Admin Panel (Docker)

Админ-панель для управления прокси-пользователями с протоколами `HTTP` и `MTProto` в контейнерах Docker.

Текущий релиз: `1.0.1` (см. `CHANGELOG.md`).

## Что умеет

- создание/удаление/редактирование прокси-пользователей;
- включение/отключение доступа к `HTTP` и `MTProto` отдельно;
- live-счетчик трафика и количества запросов (входящий/исходящий/общий, обновляется каждые 2 секунды);
- backup полной SQLite БД панели (`.db`, пользователи, трафик, сэмплы, события лога и т.д.);
- восстановление из файла `.db` или из legacy JSON (только пользователи);
- при восстановлении из бэкапа сохраняются MTProto-секреты (ссылки `tg://proxy` не пересоздаются);
- авторизация в админ-панель (сессионная cookie);
- копирование HTTP-доступа и `tg://proxy` ссылки MTProto;
- MTProto прокси с индивидуальным секретом на пользователя;
- вкладка графиков утилизации трафика с фильтром по пользователю.

## Быстрый старт

```bash
docker compose up --build -d
```

Панель: [http://localhost:8000](http://localhost:8000)

Каталог данных на **хосте** (bind mount в контейнер как `/data`):

- Переменная **`PANEL_DATA_HOST_PATH`** в `.env` (см. `docker-compose.yml`). По умолчанию для локального запуска: `./data` относительно каталога с compose-файлом.
- В контейнере: `DATABASE_URL=sqlite:////data/panel.db`, бэкапы из панели: `/data/backups/*.db`.
- На сервере после `deploy/install.sh` каталог создаётся автоматически: **`${INSTALL_DIR}/data`** (обычно `/opt/proxy-admin-panel/data`) и прописывается в `.env`.
- Резервное копирование без Docker: скопируйте **`panel.db`** (и при необходимости `backups/`) с этого пути.

Переход со **старого именованного тома** `panel_data` на bind mount (один раз): узнайте имя тома (`docker volume ls`), затем:

```bash
mkdir -p ./data
docker run --rm -v ИМЯ_ТОМА_panel_data:/from -v "$(pwd)/data:/to" alpine sh -c 'cp -a /from/. /to/'
# в .env: PANEL_DATA_HOST_PATH=/абсолютный/путь/к/data
docker compose up -d
```

Дефолтный вход:

- логин: `admin`
- пароль: `admin123`

## Установка на пустую машину (через GitHub)

Репозиторий: `https://github.com/eliot-voodi/brathe_proxy` (ветка `main`).

Скрипт `deploy/install.sh` ставит Docker/Compose, клонирует проект, спрашивает порты/пароль/домен и поднимает стек.

Если репозиторий **приватный**, нужен GitHub PAT с правом `repo`:

```bash
apt-get update -y
apt-get install -y curl sudo
export GITHUB_TOKEN='ВАШ_PAT'
curl -fsSL -H "Authorization: token ${GITHUB_TOKEN}" \
  https://raw.githubusercontent.com/eliot-voodi/brathe_proxy/main/deploy/install.sh \
  -o /tmp/install.sh
chmod +x /tmp/install.sh
sudo GITHUB_TOKEN="${GITHUB_TOKEN}" bash /tmp/install.sh
```

Если репозиторий публичный:

```bash
apt-get update -y
apt-get install -y curl sudo
curl -fsSL https://raw.githubusercontent.com/eliot-voodi/brathe_proxy/main/deploy/install.sh -o /tmp/install.sh
chmod +x /tmp/install.sh
sudo bash /tmp/install.sh
```

Либо из уже склонированного каталога:

```bash
sudo bash deploy/install.sh
```

Шаблон переменных: `.env.example`. Секреты и база (`data/panel.db`) в git не входят — их создаёт установщик.

### Важно

- установщик делает self-check логина и показывает результат;
- используйте пароль админа только из финального вывода установщика или из `${INSTALL_DIR}/.env`.
- перед запуском Docker установщик проверяет, что ключевые порты свободны (`panel/http/mtproto`);
- установщик автоматически пытается открыть firewall порты (`panel/http/mtproto`);
- для MTProto в `.env` автоматически выставляется `MTPROTO_PUBLIC_HOST` и `MTPROTO_FAKE_TLS_DOMAIN` как DNS панели (если домен задан), иначе fallback;
- для `MTPROTO_SECRET_MODE=faketls` установщик требует указать домен панели (иначе останавливается с ошибкой);
- если домен панели задан, установщик проверяет, что DNS A-запись домена указывает на внешний IP сервера, и останавливается при mismatch (чтобы избежать MTProto "недоступен").

Прокси порты на хосте:

- HTTP: `13128` (в контейнере `3128`)
- MTProto: `2053` (в контейнере `3443`)

Публичного SOCKS5 для клиентов нет. Внутренний SOCKS sing-box (`10.210.99.10:1080`) нужен только для цепочки VLESS.

Для HTTP URL в модальном окне используется:
- `MTPROTO_PUBLIC_PORT` (по умолчанию `2053`) для `tg://proxy?...` ссылок;
- `MTPROTO_PUBLIC_HOST` (опционально) — отдельный хост для MTProto ссылки.
  Это полезно, если панель идет через Cloudflare proxy, а MTProto нужен через `DNS only` хост.
  Если не задан, панель пытается автоматически подставить внешний IP сервера.
- `MTPROTO_SECRET_MODE`:
  - `faketls` (по умолчанию, `ee` + 32 hex + hex-домен из `MTPROTO_FAKE_TLS_DOMAIN`),
  - `classic` (`dd` + 32 hex).

- `PROXY_PUBLIC_HOST`;
- `HTTP_PROXY_PORT` (по умолчанию `13128`).

Параметры минимальной нагрузки:

- `PROXY_LOGDUMP_BYTES` (по умолчанию `65536`) — как часто `3proxy` пишет промежуточные записи при длинных сессиях. Больше значение = меньше нагрузка, реже обновления.
- `TRAFFIC_POLL_INTERVAL_SECONDS` (по умолчанию `8.0`) — как часто backend читает лог и обновляет БД.

## Обновление с GitHub

Повторный запуск `sudo bash deploy/install.sh` обновляет репозиторий (в т.ч. shallow clone), записывает в `.env` тег образа `PANEL_IMAGE_TAG` по текущему коммиту и поднимает стек с `--build`, чтобы Docker не оставался на старом слое.

Вручную после `git pull` в каталоге установки:

```bash
export PANEL_IMAGE_TAG="$(git rev-parse --short HEAD)"
export PANEL_GIT_REVISION="$(git rev-parse HEAD)"
docker compose --env-file .env up -d --build
```

Проверка, что поднялась нужная ревизия: `curl -sS http://127.0.0.1:8000/health` — в JSON будет поле `revision` (полный SHA коммита, зашитый при сборке образа).

## Проверка здоровья

```bash
curl -fsS http://localhost:8000/health
```

## Очистка БД от мусора

В проекте есть сервисный скрипт `backend/app/cleanup_db.py` для SQLite БД панели:

- удаляет «сиротские» записи в `traffic_samples` и `mtproto_user_state`;
- удаляет старые `traffic_samples` по retention;
- ограничивает размер `traffic_events` (удаляет самые старые записи);
- умеет делать backup перед очисткой и запускать `VACUUM` для сжатия файла БД.

Запуск с проверкой без изменений:

```bash
cd backend
python3 app/cleanup_db.py --dry-run
```

Реальная очистка:

```bash
cd backend
python3 app/cleanup_db.py
```

Пример с дополнительной чисткой старых событий:

```bash
cd backend
python3 app/cleanup_db.py --events-retention-days 30
```

## Ежедневный backup в Telegram

Добавлен скрипт `deploy/telegram_backup.sh`:

- сначала запускает очистку БД от мусора (`backend/app/cleanup_db.py`);
- создаёт консистентный SQLite backup (`panel.db`);
- сжимает backup в `.gz` и отправляет файл в Telegram через бота;
- хранит локально только последние `8` файлов (старые удаляет).

1) Добавьте в `.env`:

```bash
TELEGRAM_BOT_TOKEN='123456789:your_bot_token'
TELEGRAM_CHAT_ID='-1001234567890'
TELEGRAM_TOPIC_ID='109234'
```

`TELEGRAM_TOPIC_ID` — опционально, нужен только если отправляете в конкретный topic (форум) группы.

2) Проверка ручного запуска:

```bash
cd /opt/proxy-admin-panel
bash deploy/telegram_backup.sh
```

3) Включить ежедневный запуск (cron):

```bash
cd /opt/proxy-admin-panel
bash deploy/telegram_backup.sh --install-cron
```

По умолчанию cron ставится на `03:10` каждый день.  
Можно указать своё время:

```bash
bash deploy/telegram_backup.sh --install-cron --cron-schedule "0 2 * * *"
```

## API

- `GET /api/users` - список пользователей (пагинация: `page`, `per_page`, опционально `q`)
- `GET /api/traffic/samples` - данные для графиков (все/по пользователю)
- `POST /api/auth/login` - вход в панель
- `POST /api/auth/logout` - выход из панели
- `GET /api/auth/me` - проверка сессии
- `GET /api/meta` - host/port для Telegram SOCKS ссылки
- `POST /api/users` - создать пользователя
- `PUT /api/users/{id}` - обновить пользователя
- `DELETE /api/users/{id}` - удалить пользователя
- `POST /api/backup` - выгрузить снимок SQLite (`.db`)
- `POST /api/restore` - восстановить из `.db` или legacy JSON

## Примечание по безопасности

Пароли пользователей в этой реализации хранятся в базе в открытом виде, потому что `3proxy` использует их для авторизации и требуется точный backup/restore "1-в-1". Для production рекомендуется:

- ограничить сетевой доступ к панели;
- использовать reverse proxy + TLS + auth;
- шифровать volume/backup на уровне инфраструктуры.
