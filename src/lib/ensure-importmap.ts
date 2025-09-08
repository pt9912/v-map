import { IMPORT_MAP_JSON } from './versions.gen';

export function ensureImportMap({ allowOverride = true } = {}) {
  if (allowOverride && document.querySelector('script[type="importmap"]'))
    return;

  if (!document.querySelector('script[type="importmap"][data-v-map]')) {
    const s = document.createElement('script');
    s.type = 'importmap';
    s.dataset.vMap = 'true';
    s.textContent = IMPORT_MAP_JSON;
    document.head.appendChild(s);
  }
}
