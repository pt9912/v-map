// // lib/ol-loader.ts
// import type { OlNS } from '../../types/namespaces';
// import type * as OLTypes from 'ol';

// export async function loadOl(version = OL_VERSION): Promise<OlNS> {
//   const v = version.replace(/^[^\d]*/, '');
//   const url = `https://cdn.jsdelivr.net/npm/ol@${v}/dist/ol.js`;
//   if (!window.ol) {
//     await new Promise<void>((resolve, reject) => {
//       const id = 'ol-cdn-script';
//       if (document.getElementById(id)) return resolve();
//       const s = document.createElement('script');
//       s.id = id;
//       s.async = true;
//       s.src = url;
//       s.onload = () => resolve();
//       s.onerror = () =>
//         reject(new Error(`OL Script konnte nicht geladen werden: ${url}`));
//       document.head.appendChild(s);
//     });
//   }
//   const ol = window.ol as OlNS | undefined;
//   if (!ol) throw new Error('window.ol ist nicht verfügbar (Ladefehler?)');

//   // Falls verfügbar: Versionsprüfung (OL stellt oft eine Versionskonstante bereit)
//   const actual = (ol as typeof OLTypes).VERSION;
//   if (actual !== 'unknown') {
//     const wantMM = String(version).match(/^\d+\.\d+/)?.[0];
//     const haveMM = String(actual).match(/^\d+\.\d+/)?.[0];
//     if (wantMM && haveMM && wantMM !== haveMM) {
//       throw new Error(
//         `OL Version Mismatch: erwartet ~${version}, geladen ${actual} (URL: ${url})`,
//       );
//     }
//   }
//   return ol;
// }
