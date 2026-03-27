// stencil.config.ts
import { Config } from '@stencil/core';
import type { Plugin } from 'rollup';

const createTestingNodePolyfills = (): Plugin => {
  const sources = new Map<string, string>();

  const stringDecoderSource = `const normalizeEncoding = (encoding) => {
  if (!encoding) {
    return 'utf8';
  }
  const normalized = String(encoding).toLowerCase();
  switch (normalized) {
    case 'utf-8':
      return 'utf8';
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return 'utf16le';
    default:
      return normalized;
  }
};

const toUint8Array = (input) => {
  if (input instanceof Uint8Array) {
    return input;
  }
  if (input && typeof input.buffer !== 'undefined') {
    return new Uint8Array(input.buffer, input.byteOffset || 0, input.byteLength || input.buffer.byteLength || 0);
  }
  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  }
  if (Array.isArray(input)) {
    return Uint8Array.from(input);
  }
  if (typeof input === 'number') {
    return Uint8Array.of(input & 0xff);
  }
  return new Uint8Array();
};

const decodeWithFallback = (view) => {
  let result = '';
  for (let i = 0; i < view.length; i += 1) {
    result += String.fromCharCode(view[i]);
  }
  return result;
};

class StringDecoder {
  constructor(encoding = 'utf8') {
    this.encoding = normalizeEncoding(encoding);
    const targetEncoding = this.encoding === 'utf8' ? 'utf-8' : this.encoding;
    this._decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder(targetEncoding) : null;
  }

  write(input) {
    if (input == null) {
      return '';
    }
    if (typeof input === 'string') {
      return input;
    }
    const view = toUint8Array(input);
    if (view.length === 0) {
      return '';
    }
    if (this._decoder) {
      try {
        return this._decoder.decode(view, { stream: true });
      } catch (error) {
        if (typeof console !== 'undefined' && typeof console.warn === 'function') {
          console.warn('[string_decoder polyfill] Falling back to charCode decoding', error);
        }
      }
    }
    return decodeWithFallback(view);
  }

  end(input) {
    if (input == null) {
      return '';
    }
    return this.write(input);
  }
}

export { StringDecoder };
export default { StringDecoder };`;
  sources.set('string_decoder', stringDecoderSource);

  const eventsSource = `const listenersMapSymbol = Symbol('listenersMap');

class EventEmitter {
  constructor() {
    this[listenersMapSymbol] = new Map();
  }

  addListener(event, listener) {
    return this.on(event, listener);
  }

  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }
    const map = this[listenersMapSymbol];
    const handlers = map.get(event);
    if (handlers) {
      handlers.push(listener);
    } else {
      map.set(event, [listener]);
    }
    return this;
  }

  once(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }
    const wrapped = (...args) => {
      this.off(event, wrapped);
      listener.apply(this, args);
    };
    wrapped.listener = listener;
    return this.on(event, wrapped);
  }

  removeListener(event, listener) {
    if (!listener) {
      return this;
    }
    const map = this[listenersMapSymbol];
    const handlers = map.get(event);
    if (!handlers) {
      return this;
    }
    for (let i = handlers.length - 1; i >= 0; i -= 1) {
      const current = handlers[i];
      if (current === listener || current.listener === listener) {
        handlers.splice(i, 1);
      }
    }
    if (handlers.length === 0) {
      map.delete(event);
    }
    return this;
  }

  off(event, listener) {
    return this.removeListener(event, listener);
  }

  removeAllListeners(event) {
    const map = this[listenersMapSymbol];
    if (typeof event === 'undefined') {
      map.clear();
    } else {
      map.delete(event);
    }
    return this;
  }

  emit(event, ...args) {
    const map = this[listenersMapSymbol];
    const handlers = map.get(event);
    if (!handlers || handlers.length === 0) {
      return false;
    }
    handlers.slice().forEach(handler => handler.apply(this, args));
    return true;
  }

  listeners(event) {
    const map = this[listenersMapSymbol];
    const handlers = map.get(event);
    return handlers ? handlers.slice() : [];
  }

  listenerCount(event) {
    return this.listeners(event).length;
  }
}

EventEmitter.prototype.addListener = EventEmitter.prototype.on;

const defaultMaxListeners = 10;

export { EventEmitter, defaultMaxListeners };
export default { EventEmitter, defaultMaxListeners };
`;
  sources.set('events', eventsSource);

  const prefix = '\0testing-node-polyfill:';

  return {
    name: 'testing-node-polyfills',
    enforce: 'pre',
    resolveId(id) {
      if (sources.has(id)) {
        return `${prefix}${id}`;
      }
      if (id.startsWith(prefix)) {
        return id;
      }
      return null;
    },
    load(id) {
      if (id.startsWith(prefix)) {
        const key = id.slice(prefix.length);
        return sources.get(key) ?? null;
      }
      return null;
    },
  };
};

export const config: Config = {
  namespace: 'v-map',
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: true,
    },
    {
      type: 'www',
      serviceWorker: null,
    },
    {
      type: 'docs-readme', // generiert README pro Komponente (src/components/**/readme.md)
      strict: true,
    },
    {
      type: 'docs-json',
      file: 'docs/api/stencil-docs.json', // Machine-readable API
      strict: true,
    },
  ],
  buildEs5: false, // Deaktiviert ES5-Builds komplett (nur ES2022)
  testing: {
    setupFilesAfterEnv: ['./src/testing/setupTests.jest.ts'],
    testPathIgnorePatterns: ['\\.spec\\.ts$'],
    collectCoverageFrom: [
      'src/components/**/*.{ts,tsx}',
      '!src/components/**/*.d.ts',
      '!src/components/**/*.spec.ts',
      '!src/components/**/*.spec.tsx',
      '!src/components/**/*.e2e.ts',
      '!src/components/**/*.e2e-utils.ts',
      '!src/components/**/*.stories.ts',
      '!src/components/**/*.stories.tsx',
      '!src/components.d.ts',
    ],
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 94,
        lines: 98,
        statements: 95,
      },
    },
    // sourceMaps helfen, die TS-Zeilen zu sehen:
    // 'ts-jest' o. ä. kümmert sich idR. darum; alternativ:
    // testEnvironmentOptions: { url: 'http://localhost' },
    moduleNameMapper: {
      '^leaflet/dist/leaflet-src\\.esm\\.js$': 'leaflet',
      '^geostyler-sld-parser$':
        '<rootDir>/src/testing/mocks/geostyler-sld-parser.ts',
      '^geostyler-mapbox-parser$':
        '<rootDir>/src/testing/mocks/geostyler-mapbox-parser.ts',
      '^geostyler-qgis-parser$':
        '<rootDir>/src/testing/mocks/geostyler-qgis-parser.ts',
      '^geostyler-lyrx-parser$':
        '<rootDir>/src/testing/mocks/geostyler-lyrx-parser.ts',
      '^geostyler-style$': '<rootDir>/src/testing/mocks/geostyler-style.ts',
      '^@mapbox/tiny-sdf$': '<rootDir>/src/testing/mocks/mapbox-tiny-sdf.ts',
      '^@npm9912/s-gml$': '<rootDir>/src/testing/mocks/s-gml.ts',
    },
    transformIgnorePatterns: ['node_modules/(?!(.pnpm|ol|leaflet|@loaders\\.gl|@mapbox|@deck\\.gl|geostyler-style|geostyler-sld-parser))'],
    browserHeadless: 'shell',
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--single-process',
    ],
  },
  rollupPlugins: {
    before: [
      createTestingNodePolyfills(),
      {
        // jimp (transitive dep of geostyler-lyrx-parser) uses eval;
        // replace with empty stub so the bundle stays clean
        name: 'stub-jimp',
        resolveId(source) {
          if (source === 'jimp' || source.startsWith('@jimp/')) {
            return '\0jimp-stub';
          }
          return null;
        },
        load(id) {
          if (id === '\0jimp-stub') {
            return 'export const Jimp = {}; export default Jimp;';
          }
          return null;
        },
      },
      {
        name: 'resolve-geotiff-browser',
        resolveId(source) {
          // Leite geotiff zur Browser-Version um
          if (source === 'geotiff') {
            const path = require('path');
            const geotiffEntryPath = require.resolve('geotiff');
            const geotiffPackageDir = path.dirname(path.dirname(geotiffEntryPath));
            return {
              id: path.join(geotiffPackageDir, 'dist-browser', 'geotiff.js'),
              external: false,
            };
          }
          return null;
        },
      },
    ],
    after: [
      {
        name: 'externalize-map-libs',
        options(input) {
          return {
            ...input,
            external: [
              'leaflet',
              /^leaflet\//,
              'ol',
              /^ol\//,

              // Node.js-spezifische Module (NEU)
              'path',
              'fs',
              'util',
              'child_process',
              'crypto',
              'stream',
              'http',
              'https',
              'url',
              'zlib',
              'os',
              'net',
              'tls',
              'dns',
              'assert',
              'buffer',
              'querystring',
              'punycode',
              'path-browserify', // Falls irgendwo als Fallback verwendet

              // @loaders.gl packages that try to import Node.js modules
              '@loaders.gl/textures',
              /^@loaders\.gl\//,

            ],
          };
        },
      },
    ],
  },
  nodeResolve: {
    browser: true, // Erzwingt Browser-kompatible Module
    preferBuiltins: false, // Verhindert, dass Node.js-Built-ins eingebunden werden
  },
};
