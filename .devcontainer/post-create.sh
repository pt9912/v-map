#!/usr/bin/env bash
set -euo pipefail

echo "▶ Post-create started"

# 1) pnpm sauber aktivieren (kein globales npm -g nötig)
if ! command -v pnpm >/dev/null 2>&1; then
  echo "• Enabling pnpm via Corepack"
  corepack enable
  corepack prepare pnpm@9 --activate
fi

echo "• Node: $(node -v)"
echo "• pnpm: $(pnpm -v)"

# 2) Dependencies installieren (frozen, mit Fallback)
echo "• Installing deps"
if [[ -f pnpm-lock.yaml ]]; then
  pnpm install --frozen-lockfile || pnpm install
else
  pnpm install
fi

# 3) Headless-Browser installieren (chrome-headless-shell) + Pfad exportieren
export PUPPETEER_CACHE_DIR="${HOME}/.cache/puppeteer"
mkdir -p "$PUPPETEER_CACHE_DIR"

echo "• Installing chrome-headless-shell to ${PUPPETEER_CACHE_DIR}"
# Versuche Cache-Ziel; manche Umgebungen ignorieren -P und legen im CWD ab
pushd "$PUPPETEER_CACHE_DIR"
pnpm dlx @puppeteer/browsers install chrome-headless-shell@stable || true
popd

# Pfad robust auflösen: suche in (1) Cache, (2) Projektordner, (3) Fallbacks
find_chrome() {
  for base in "$PUPPETEER_CACHE_DIR" "$PWD" "$PWD/chrome-headless-shell" "$HOME/.cache/puppeteer" "/usr/bin"; do
    [ -d "$base" ] || continue
    # bevorzugt chrome-headless-shell, ansonsten chromium/chrome
    p="$(find "$base" -type f \( -name 'chrome-headless-shell' -o -name 'chromium' -o -name 'chrome' \) 2>/dev/null | head -n1 || true)"
    if [ -n "$p" ]; then
      echo "$p"
      return 0
    fi
  done
  return 1
}

PHS_PATH="$(find_chrome || true)"

if [ -n "${PHS_PATH:-}" ] && [ -x "$PHS_PATH" ]; then
  export PUPPETEER_EXECUTABLE_PATH="$PHS_PATH"
  echo "• PUPPETEER_EXECUTABLE_PATH=${PUPPETEER_EXECUTABLE_PATH}"
  # Für zukünftige Shells persistent machen:
  echo "export PUPPETEER_EXECUTABLE_PATH='$PHS_PATH'" >> "${HOME}/.bashrc"
else
  echo "  (warn) Could not determine chrome-headless-shell path."
  echo "        You can run tests with:"
  echo "        PUPPETEER_EXECUTABLE_PATH=\"\$(find ~/.cache/puppeteer -type f -name chrome-headless-shell | head -n1)\" pnpm run test:e2e"
fi

# 4) Optionales Bootstrap (nur wenn explizit gewünscht)
#    Setze BOOTSTRAP=1 in devcontainer.json, falls du das willst.
if [[ "${BOOTSTRAP:-0}" == "1" ]]; then
  echo "• Running optional bootstrap (Storybook/Stencils) – BOOTSTRAP=1"
  # Storybook nur installieren/initialisieren, wenn nicht vorhanden
  if ! jq -e '.devDependencies | keys[] | select(startswith("@storybook/"))' package.json >/dev/null 2>&1; then
    pnpm add -D @storybook/web-components @storybook/stencil
    # KEIN 'sb init', weil das oft Dateien überschreibt.
    # Stattdessen deine vorhandene Storybook-Konfig beibehalten.
  fi
  # Stencil CLI ist über @stencil/core schon abgedeckt; keine globale Installation nötig.
fi

# disable telemetry
npx stencil telemetry off

#claude code
npm install -g @anthropic-ai/claude-code

# Chrome immer ohne Sandbox starten (für Tools, die Flags nicht durchreichen)
echo "export PRESS_CHROMIUM_ARGS='--no-sandbox --disable-setuid-sandbox'" >> "${HOME}/.bashrc"
echo "export CHROMIUM_FLAGS='--no-sandbox --disable-setuid-sandbox'" >> "${HOME}/.bashrc"

echo "✅ Dev-Container ist bereit."
echo "   • Build:        pnpm run build"
echo "   • Storybook:    pnpm run storybook"
echo "   • Tests (spec): pnpm run test:spec"
echo "   • Tests (e2e):  pnpm run test:e2e"
