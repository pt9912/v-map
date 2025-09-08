// src/utils/layer-helpers.ts
import { VMapLayer } from '../types/vmaplayer';
//import { VMapEvents } from './events';

/**
 * Sucht im angegebenen Root‑Element nach allen Web‑Components,
 * deren Tag‑Name mit "v‑map‑layer‑" beginnt, und castet sie zu VMapLayer.
 */
/*
export function getTypedMapLayers(root: ParentNode = document): VMapLayer[] {
  const raw = Array.from(root.querySelectorAll<HTMLElement>('*')).filter(el =>
    el.tagName.toLowerCase().startsWith('v-map-layer-'),
  );

  // Jetzt jedes Element mit dem Type‑Guard prüfen
  const typed: VMapLayer[] = raw.filter(isVMapLayer) as unknown as VMapLayer[];

  // Optional: Warnung, wenn einige Elemente das Interface nicht erfüllen
  if (typed.length < raw.length) {
    console.warn(
      `[VMapLayer] ${
        raw.length - typed.length
      } gefundene Elemente entsprechen nicht dem erwarteten Interface.`,
    );
  }

  return typed;
}
  */

/**
 * Prüft, ob ein HTMLElement das VMapLayer‑Interface implementiert.
 *
 * Wir testen nur die minimalen, unveränderlichen Eigenschaften:
 *   - visible (boolean)
 *   - refresh (Funktion, die ein Promise zurückgibt)
 *
 * Wenn du weitere optionale Felder prüfen willst, ergänze sie hier.
 */
export function isVMapLayer(el: unknown): el is VMapLayer {
  // 1️⃣ Grundlegender Typ‑Check: muss ein Objekt sein und HTMLElement erweitern
  if (typeof el !== 'object' || el === null) return false;
  const candidate = el as Partial<VMapLayer>;

  // 2️⃣ `visible` muss ein Boolean sein
  if (typeof candidate.visible !== 'boolean') return false;

  // 3️⃣ `refresh` muss eine Funktion sein
  if (typeof candidate.addToMap !== 'function') return false;

  // 4️⃣ Optional: sicherstellen, dass `refresh` ein Promise zurückgibt.
  //    Wir rufen die Methode nicht wirklich auf – das könnte Seiteneffekte haben.
  //    Stattdessen prüfen wir, ob die Funktion **eine** `then`‑Eigenschaft zurückgibt,
  //    wenn sie sofort aufgerufen wird (nur ein kleiner Hinweis, kein 100 %iger Test).
  try {
    const maybePromise = (candidate.addToMap as any)();
    if (
      maybePromise &&
      typeof maybePromise.then === 'function' &&
      typeof maybePromise.catch === 'function'
    ) {
      // Alles gut – die Methode gibt ein Promise‑ähnliches Objekt zurück.
    }
  } catch {
    // Wenn das Aufrufen von `refresh` einen Fehler wirft, gehen wir davon aus,
    // dass das Objekt nicht das erwartete Interface hat.
    return false;
  }

  //  // 5️⃣ Optional: `id` darf, muss aber nicht existieren – wenn es existiert, muss es ein string sein
  //  if ('id' in candidate && typeof candidate.id !== 'string') return false;

  // Wenn alle Checks passieren, gilt das Element als VMapLayer
  return true;
}

/*
export async function layersReady(layers: VMapLayer[]) {
  // sicherstellen, dass jedes Element wirklich ready ist
  await Promise.all(layers.map(l => (l as any).componentOnReady?.()));
}
*/
/*
async function ensureReady(el: HTMLElement): Promise<void> {
  const maybeReady = (el as any).componentOnReady;

  // Existiert die Methode überhaupt?
  if (typeof maybeReady === 'function') {
    // Rufe sie auf – sie liefert ein Promise.
    // Wenn das Element bereits ready ist, löst das Promise sofort auf.
    await maybeReady.call(el);
  }
  // Wenn keine Methode existiert, machen wir nichts.
}
*/
declare global {
  interface CustomElementConstructor {
    componentOnReady?(el: HTMLElement): Promise<void>;
  }
}

/**
 * Holt alle Layer‑Elements, wartet ggf. auf componentOnReady
 * und gibt nur die tatsächlich gültigen VMapLayer‑Instanzen zurück.
 */
export async function getReadyMapLayers(
  root: ParentNode = document,
): Promise<VMapLayer[]> {
  // 1️⃣ Alle potenziellen Elemente finden
  const raw = Array.from(root.querySelectorAll<HTMLElement>('*')).filter(el =>
    el.tagName.toLowerCase().startsWith('v-map-layer-'),
  );

  // 1. Warten, bis alle Elemente definiert sind
  await Promise.all(
    raw.map(el => customElements.whenDefined(el.tagName.toLowerCase())),
  );

  // 2. Klassen abrufen und componentOnReady aufrufen
  const mapLayers = await Promise.all(
    raw.map(async el => {
      const componentClass = customElements.get(
        el.tagName.toLowerCase(),
      ) as CustomElementConstructor & {
        componentOnReady?: (el: HTMLElement) => Promise<void>;
      };

      if (componentClass?.componentOnReady) {
        await componentClass.componentOnReady(el);
        return el;
      } else {
        const mapLayer: VMapLayer = el as unknown as VMapLayer;
        if (mapLayer.isReady()) return el;
        /*        // Fallback: Event-Listener
        await new Promise<void>(resolve => {
          el.addEventListener(VMapEvents.Ready, () => resolve(), {
            once: true,
          });
        });
        */
      }
      return null; //el;
    }),
  );
  return mapLayers as unknown as VMapLayer[];
}
