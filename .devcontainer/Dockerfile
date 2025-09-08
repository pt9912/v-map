# Basis-Image mit Node.js 22
FROM mcr.microsoft.com/devcontainers/typescript-node:22

# Installiere Git (für Storybook-Integration)
RUN apt-get update && apt-get install -y git

# Installiere Chrome (für Storybook-Tests)
RUN apt-get install -y wget gnupg
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable

# Standardbenutzer einrichten (nur Berechtigungen setzen, da Benutzer bereits existiert)
RUN mkdir -p /workspaces && chown -R node /workspaces
USER node
WORKDIR /workspaces/v-map
