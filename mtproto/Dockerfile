FROM debian:12-slim

ARG TARGETARCH
ARG TELEMT_VERSION=latest

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends ca-certificates curl tar; \
    rm -rf /var/lib/apt/lists/*; \
    arch="${TARGETARCH:-}"; \
    if [ -z "${arch}" ]; then \
        case "$(uname -m)" in \
            x86_64) arch=amd64 ;; \
            aarch64|arm64) arch=arm64 ;; \
            *) echo "Unsupported uname: $(uname -m)" >&2; exit 1 ;; \
        esac; \
    fi; \
    case "${arch}" in \
        amd64) ASSET="telemt-x86_64-linux-musl.tar.gz" ;; \
        arm64) ASSET="telemt-aarch64-linux-musl.tar.gz" ;; \
        *) echo "Unsupported TARGETARCH: ${arch}" >&2; exit 1 ;; \
    esac; \
    VERSION="${TELEMT_VERSION#refs/tags/}"; \
    if [ -z "${VERSION}" ] || [ "${VERSION}" = "latest" ]; then \
        BASE_URL="https://github.com/telemt/telemt/releases/latest/download"; \
    else \
        BASE_URL="https://github.com/telemt/telemt/releases/download/${VERSION}"; \
    fi; \
    curl -fL --retry 5 --retry-delay 3 -o "/tmp/${ASSET}" "${BASE_URL}/${ASSET}"; \
    tar -xzf "/tmp/${ASSET}" -C /tmp; \
    install -m 0755 /tmp/telemt /usr/local/bin/telemt; \
    rm -rf "/tmp/${ASSET}" /tmp/telemt

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
