
# Basis-Image mit Node.js 22
FROM mcr.microsoft.com/devcontainers/typescript-node:22

# (Optional) System-Tools
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
  git \
  libnss3 libnspr4 \
  libatk1.0-0 libatk-bridge2.0-0 libatspi2.0-0 \
  libcups2 libdrm2 libgbm1 \
  libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
  libx11-6 libx11-xcb1 libxcb1 libxext6 libxrandr2 libxrender1 libxshmfence1 \
  libglib2.0-0 \
  libcairo2 libpango-1.0-0 libpangocairo-1.0-0 \
  libasound2 \
  fonts-liberation \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Standardbenutzer einrichten (nur Berechtigungen setzen, da Benutzer bereits existiert)
RUN mkdir -p /workspaces && chown -R node /workspaces

RUN npm install -g @anthropic-ai/claude-code@2.0.9

USER node
WORKDIR /workspaces/v-map
