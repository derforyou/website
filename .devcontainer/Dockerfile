FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl xz-utils \
    && rm -rf /var/lib/apt/lists/*

COPY .nvmrc package.json /tmp/node-versions/

RUN set -eux; \
    NODE_VERSION="$(cat /tmp/node-versions/.nvmrc)"; \
    NPM_VERSION="$(sed -n 's/.*"packageManager": "npm@\([^"]*\)".*/\1/p' /tmp/node-versions/package.json)"; \
    case "$(dpkg --print-architecture)" in \
        amd64) NODE_ARCH=x64 ;; \
        arm64) NODE_ARCH=arm64 ;; \
        *) echo "Unsupported architecture" >&2; exit 1 ;; \
    esac; \
    ARCHIVE="node-v${NODE_VERSION}-linux-${NODE_ARCH}.tar.xz"; \
    TEMP_DIR="$(mktemp -d)"; \
    curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/SHASUMS256.txt" -o "${TEMP_DIR}/SHASUMS256.txt"; \
    curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/${ARCHIVE}" -o "${TEMP_DIR}/${ARCHIVE}"; \
    (cd "${TEMP_DIR}" && grep "  ${ARCHIVE}$" SHASUMS256.txt | sha256sum -c -); \
    tar -xJf "${TEMP_DIR}/${ARCHIVE}" --strip-components=1 -C /usr/local; \
    rm -rf "${TEMP_DIR}"; \
    npm install --global "npm@${NPM_VERSION}"; \
    test "$(node --version)" = "v${NODE_VERSION}"; \
    test "$(npm --version)" = "${NPM_VERSION}"
