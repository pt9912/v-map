import { Build } from '@stencil/core';

/* -----------------------------------------------------------------------
 *  Logger – leichtgewichtiger, konfigurierbarer Wrapper um console.*
 *  Unterstützt Log-Levels, Namespaces und benutzerdefinierte Transports.
 *  Merkmale:
 *   - Persistentes Log-Level (localStorage)
 *   - isProd via Stencil Build-Flag
 *   - Optionale DevTools-Hooks (nur im Dev-Modus)
 * --------------------------------------------------------------------- */

type LogLevel = 'none' | 'error' | 'warn' | 'info' | 'debug';

/**
 * Transport-Interface – definiert, wohin ein Log geschrieben wird.
 * Du kannst z. B. einen HTTP-Transport für Remote-Logging implementieren.
 */
export interface LogTransport {
  /** Log-Methode, die vom Logger intern aufgerufen wird. */
  log(level: LogLevel, args: readonly unknown[], namespace?: string): void;
}

/** Stencil-nativ: prod = !Build.isDev */
export const isProd: boolean = !Build.isDev;

// ---- Exposure-Gate (macht Konsole-APIs auch in Prod verfügbar, wenn explizit aktiviert) ----
const EXPOSE_KEY = '@pt9912/v-map:exposeConsoleAPI';
const urlHasDebugFlag = (() => {
  try {
    return (
      typeof location !== 'undefined' &&
      new URLSearchParams(location.search).has('vmapDebug')
    );
  } catch {
    return false;
  }
})();
const exposureEnabled =
  !isProd ||
  urlHasDebugFlag ||
  (typeof localStorage !== 'undefined' &&
    localStorage.getItem(EXPOSE_KEY) === '1');

/* ------------------------- Storage-Helfer -------------------------- */

const LS_KEY = '@pt9912/v-map:logLevel';

function getLocalStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      return window.localStorage;
    }
  } catch {
    /* no-op (Privacy/Storage blocked o. Ä.) */
  }
  return null;
}

function readPersistedLevel(): LogLevel | null {
  const ls = getLocalStorage();
  if (!ls) return null;
  const raw = ls.getItem(LS_KEY);
  if (!raw) return null;
  if (
    raw === 'none' ||
    raw === 'error' ||
    raw === 'warn' ||
    raw === 'info' ||
    raw === 'debug'
  ) {
    return raw;
  }
  return null;
}

function writePersistedLevel(level: LogLevel): void {
  const ls = getLocalStorage();
  if (!ls) return;
  try {
    ls.setItem(LS_KEY, level);
  } catch {
    /* no-op */
  }
}

/* ---------- 1️⃣ Runtime-Konfiguration (Log-Level, Transport) ---------- */

/** Standard-Default: prod -> bis warn, dev -> bis debug */
const DEFAULT_LEVEL: LogLevel = isProd ? 'warn' : 'debug';

/** Initiales Level: persisted > default */
let currentLevel: LogLevel = readPersistedLevel() ?? DEFAULT_LEVEL;

/** Standard-Transport: schreibt in die native Browser-Console. */
class ConsoleTransport implements LogTransport {
  log(level: LogLevel, args: readonly unknown[], ns?: string) {
    const prefix = ns ? `[${ns}]` : undefined;
    const enhancedArgs: unknown[] = [...args];
    if (level === 'debug' || level === 'warn' || level === 'error') {
      const showTrace =
        level === 'debug' || level === 'warn' || level === 'error';
      const stackTrace = showTrace
        ? new Error().stack?.split('\n')[4]?.trim()
        : null;
      if (stackTrace) {
        enhancedArgs.push(`${stackTrace}`);
      }
    }

    // eslint-disable-next-line no-console
    switch (level) {
      case 'debug':
      case 'info':
        prefix
          ? console.log(prefix, ...enhancedArgs)
          : console.log(...enhancedArgs);
        break;
      case 'warn':
        prefix
          ? console.warn(prefix, ...enhancedArgs)
          : console.warn(...enhancedArgs);
        break;
      case 'error':
        prefix
          ? console.error(prefix, ...enhancedArgs)
          : console.error(...enhancedArgs);
        break;
      // 'none' wird nicht geroutet
    }
  }
}

let transport: LogTransport = new ConsoleTransport();

/**
 * Ändert das globale Log-Level zur Laufzeit und persistiert es.
 * Praktisch für Tests, Feature-Flags und DevTools.
 */
export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
  writePersistedLevel(level);
}

/** Aktuelles Log-Level abfragen (z. B. in DevTools) */
export function getLogLevel(): LogLevel {
  return currentLevel;
}

/**
 * Ersetzt den aktiven Transport (z. B. für Remote-Logging).
 */
export function setTransport(t: LogTransport): void {
  transport = t;
}

/* ---------------------- 2️⃣ Hilfsfunktionen ---------------------- */

/** Prüft, ob ein gegebener Level laut aktueller Konfiguration ausgegeben werden darf. */
function shouldLog(level: LogLevel): boolean {
  const order: Record<LogLevel, number> = {
    none: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  };
  return order[level] <= order[currentLevel];
}

/** Kern-Logger – wird von den öffentlichen Methoden genutzt. */
function _log(
  level: LogLevel,
  args: readonly unknown[],
  namespace?: string,
): void {
  if (!shouldLog(level)) return;
  transport.log(level, args, namespace);
}

/* ---------------------- 3️⃣ Öffentliche API ---------------------- */

/**
 * Erzeugt eine Logger-Instanz mit Namespace-Präfix.
 * Ideal für Komponenten: `const log = createLogger('MyComponent');`
 */
export function createLogger(namespace: string) {
  return {
    debug: (...args: unknown[]) => _log('debug', args, namespace),
    info: (...args: unknown[]) => _log('info', args, namespace),
    warn: (...args: unknown[]) => _log('warn', args, namespace),
    error: (...args: unknown[]) => _log('error', args, namespace),
  };
}

/* ----------- 4️⃣ Convenience-Wrapper für globale Nutzung ------------ */

export const log = (...args: unknown[]) => _log('debug', args);
export const info = (...args: unknown[]) => _log('info', args);
export const warn = (...args: unknown[]) => _log('warn', args);
export const error = (...args: unknown[]) => _log('error', args);

/* ---------------- 5️⃣ DevTools-Exposure (nur im Dev) ---------------- */

declare global {
  interface Window {
    setLogLevel?: (level: LogLevel) => void;
    getLogLevel?: () => LogLevel;
    log?: (...args: unknown[]) => void;
    info?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
    error?: (...args: unknown[]) => void;
  }
}

if (exposureEnabled && typeof globalThis !== 'undefined') {
  (globalThis as any).setLogLevel = setLogLevel;
  (globalThis as any).getLogLevel = getLogLevel;
  (globalThis as any).log = (...args: unknown[]) => log(...args);
  (globalThis as any).info = (...args: unknown[]) => info(...args);
  (globalThis as any).warn = (...args: unknown[]) => warn(...args);
  (globalThis as any).error = (...args: unknown[]) => error(...args);
}

//devtools
//http://localhost:6006/?path=/docs/...&vmapDebug
/*
localStorage.setItem('@pt9912/v-map:exposeConsoleAPI', '1');
localStorage.getItem('@pt9912/v-map:exposeConsoleAPI');
location.reload();
*/
/*
const LOG_LEVEL='debug'
const KEY = '@pt9912/v-map:logLevel';
for (let i = 0; i < top.frames.length; i++) {
  try { top.frames[i].localStorage.setItem(KEY, LOG_LEVEL); } catch {}
}
try { window.localStorage.setItem(KEY, LOG_LEVEL); } catch {}
top.location.reload();
*/

//getLogLevel()
//setLogLevel('info')
