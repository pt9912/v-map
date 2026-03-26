import proj4 from 'proj4';

import { error, warn } from '../../utils/logger';

import type { GeoTIFFImage } from 'geotiff';
import type { Options as GeoTIFFOptions } from 'ol/source/GeoTIFF';
import GeoTIFF from 'ol/source/GeoTIFF';
import type { GeoKeys, ProjectionParameters } from 'geotiff-geokeys-to-proj4';

import geokeysToProj4 from 'geotiff-geokeys-to-proj4';

import type { Projection } from 'ol/proj';

import { get as getProjection } from 'ol/proj';
import { register } from 'ol/proj/proj4';

type GeoKeysLike = Partial<GeoKeys>;

export interface CustomGeoTiffInstance extends GeoTIFF {
  getGeoKeys(): Promise<GeoKeysLike | null>;
  getProjectionParameters(): Promise<ProjectionParameters | null>;
  getProj4String(): Promise<string | null>;
  registerProjectionIfNeeded(): Promise<Projection | null>;
}

export type CustomGeoTiffConstructor = new () => CustomGeoTiffInstance;

// let projectionHelpersPromise: Promise<ProjectionHelpers> | null = null;
// async function loadProjectionHelpers(): Promise<ProjectionHelpers> {
//   if (!projectionHelpersPromise) {
//     projectionHelpersPromise = Promise.all([
//       import('ol/proj'),
//       import('ol/proj/proj4'),
//     ]).then(([projModule, proj4Module]) => ({
//       getProjection: getProjection,
//       register: register,
//     }));
//   }
//   return projectionHelpersPromise;
// }

export async function createCustomGeoTiff(
  options: GeoTIFFOptions,
): Promise<CustomGeoTiffConstructor> {
  /**
   * Gibt die GeoKeys eines GeoTIFF-Bildes zurück.
   * @param image Das GeoTIFF-Bild.
   * @returns Die GeoKeys oder `null`, falls keine vorhanden sind.
   */
  function getGeoKeys(image: GeoTIFFImage): GeoKeysLike | null {
    if (typeof image.getGeoKeys === 'function') {
      return image.getGeoKeys() || null;
    }
    return (image as GeoTIFFImage & { geoKeys?: GeoKeysLike | null }).geoKeys || null;
  }

  return class CustomGeoTiff extends GeoTIFF {
    private geoKeys_: GeoKeysLike | null = null;

    constructor() {
      super(options);
    }

    /**
     * Gibt die GeoKeys der ersten Quelle zurück.
     * @returns Ein Promise, das die GeoKeys oder `null` zurückgibt.
     */
    public async getGeoKeys(): Promise<GeoKeysLike | null> {
      if (this.geoKeys_ !== null) {
        return this.geoKeys_;
      }

      await this.getView();

      //const sources = this.sources_;
      // @ts-expect-error Zugriff auf private Eigenschaft `sourceImagery_`
      const sources = this.sourceImagery_;
      if (sources && sources.length > 0) {
        this.determineGeoKeys(sources);
      }

      return this.geoKeys_;
    }

    /**
     * Bestimmt die GeoKeys aus den Quellen.
     * @param sources Die Quellen des GeoTIFFs.
     */
    private determineGeoKeys(sources: Array<Array<GeoTIFFImage>>): void {
      if (!sources || sources.length === 0) {
        return;
      }

      const firstSource = sources[0];
      for (let i = firstSource.length - 1; i >= 0; --i) {
        const image = firstSource[i];
        const geoKeys = getGeoKeys(image);
        if (geoKeys) {
          this.geoKeys_ = geoKeys;
          break;
        }
      }
    }

    /**
     * Gibt die Proj4-Projektionsparameter basierend auf den GeoKeys zurück.
     * @returns Ein Promise, das die Proj4-Projektionsparameter oder `null` zurückgibt.
     */
    public async getProjectionParameters(): Promise<ProjectionParameters | null> {
      const geoKeys = await this.getGeoKeys();
      if (!geoKeys) {
        return null;
      }

      return geokeysToProj4.toProj4(geoKeys as GeoKeys);
    }

    /**
     * Gibt die Proj4-Projektion als String basierend auf den GeoKeys zurück.
     * @returns Ein Promise, das die Proj4-Projektion als String oder `null` zurückgibt.
     */
    public async getProj4String(): Promise<string | null> {
      const params = await this.getProjectionParameters();
      if (!params) {
        return null;
      }

      // Proj4-String aus den Parametern erstellen
      return params.proj4 || null;
    }

    //   /**
    //    * Registriert die Proj4-Projektion in OpenLayers, falls sie noch nicht existiert.
    //    * @param proj4String Die Proj4-Projektion als String.
    //    * @param code Der Code für die Projektion (z. B. 'CUSTOM:1234').
    //    * @returns Die OpenLayers-Projektion oder `null`, falls die Registrierung fehlschlägt.
    //    */
    //   public async registerProjectionIfNeeded(
    //     proj4String: string,
    //     code: string,
    //   ): Promise<import('ol/proj').Projection | null> {
    //     try {
    //       const existingProjection = getProjection(code);
    //       if (existingProjection) {
    //         return existingProjection;
    //       }

    //       proj4.defs(code, proj4String);
    //       register(proj4);
    //       return getProjection(code);
    //     } catch (err) {
    //       error('Fehler bei der Registrierung der Projektion:', err);
    //       return null;
    //     }
    //   }

    /**
     * Registriert die Proj4-Projektion in OpenLayers, falls sie noch nicht existiert.
     * @returns Die OpenLayers-Projektion oder `null`, falls die Registrierung fehlschlägt.
     */
    public async registerProjectionIfNeeded(): Promise<Projection | null> {
      try {
        //const { getProjection, register } = await loadProjectionHelpers();
        const proj4String = await this.getProj4String();
        const code = this.getProjection()?.getCode();
        const existingProjection = getProjection(code);
        if (existingProjection) {
          return existingProjection;
        }
        if (proj4String === null) {
          warn(`Can not get proj string for code: ${code}`);
          return null;
        }

        proj4.defs(code, proj4String);
        register(proj4);
        return getProjection(code);
      } catch (err) {
        error('Fehler bei der Registrierung der Projektion:', err);
        return null;
      }
    }

    //   /**
    //    * Gibt die OpenLayers-Projektion basierend auf den GeoKeys zurück und registriert sie bei Bedarf.
    //    * @param code Der Code für die Projektion (z. B. 'CUSTOM:1234').
    //    * @returns Ein Promise, das die OpenLayers-Projektion oder `null` zurückgibt.
    //    */
    //   public async getProjectionFromGeoKeys(
    //     code: string,
    //   ): Promise<import('ol/proj').Projection | null> {
    //     const proj4String = await this.getProj4String();
    //     if (!proj4String) {
    //       return null;
    //     }

    //     return this.registerProjectionIfNeeded(proj4String, code);
    //   }
  } as CustomGeoTiffConstructor;
}
