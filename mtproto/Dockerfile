FROM debian:12-slim

ARG TARGETARCH
ARG TELEMT_VERSION=latest

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends ca-certificates curl tar file; \
    rm -rf /var/lib/apt/lists/*; \
    native="$(uname -m)"; \
    case "${native}" in \
        x86_64) ASSET="telemt-x86_64-linux-musl.tar.gz" ;; \
        aarch64|arm64) ASSET="telemt-aarch64-linux-musl.tar.gz" ;; \
        *) \
            case "${TARGETARCH:-}" in \
                amd64) ASSET="telemt-x86_64-linux-musl.tar.gz" ;; \
                arm64) ASSET="telemt-aarch64-linux-musl.tar.gz" ;; \
                *) echo "Unsupported arch native=${native} TARGETARCH=${TARGETARCH:-}" >&2; exit 1 ;; \
            esac ;; \
    esac; \
    VERSION="${TELEMT_VERSION#refs/tags/}"; \
    if [ -z "${VERSION}" ] || [ "${VERSION}" = "latest" ]; then \
        BASE_URL="https://github.com/telemt/telemt/releases/latest/download"; \
    else \
        BASE_URL="https://github.com/telemt/telemt/releases/download/${VERSION}"; \
    fi; \
    echo "Downloading ${ASSET} (native=${native} TARGETARCH=${TARGETARCH:-})"; \
    curl -fL --retry 5 --retry-delay 3 -o "/tmp/${ASSET}" "${BASE_URL}/${ASSET}"; \
    tar -xzf "/tmp/${ASSET}" -C /tmp; \
    install -m 0755 /tmp/telemt /usr/local/bin/telemt; \
    file /usr/local/bin/telemt; \
    case "${native}" in \
        aarch64|arm64) file /usr/local/bin/telemt | grep -Eq 'ARM aarch64|ARM64|aarch64' ;; \
        x86_64) file /usr/local/bin/telemt | grep -Eq 'x86-64|x86_64' ;; \
    esac; \
    rm -rf "/tmp/${ASSET}" /tmp/telemt

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
