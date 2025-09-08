#!/bin/bash

# Abhängigkeiten installieren
npm install -g pnpm
pnpm install

# Stencil-CLI global installieren
#npm install -g @stencil/cli

# Projekt initialisieren (falls noch nicht geschehen)
if [ ! -f "package.json" ]; then
  npm init stencil components v-map
fi

# Storybook installieren (falls noch nicht geschehen)
if ! grep -q "@storybook" package.json; then
  npm install @storybook/web-components @storybook/stencil --save-dev
  npx sb init --type html
fi

# Dev-Server starten (optional)
echo "Dev-Container ist bereit! Führe 'npm run dev' oder 'npm run storybook' aus."
