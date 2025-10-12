import type { Layer } from '@deck.gl/core';
import type { GeoKeys, ProjectionParameters } from 'geotiff-geokeys-to-proj4';
import type { CogBitmapLayerProps } from '@gisatcz/deckgl-geolib';
import { log, warn } from '../../utils/logger';

/**
 * Erstellt einen reprojizierten CogBitmapLayer für deck.gl.
 * @param layerId Eindeutige Layer-ID.
 * @param url URL des gekachelten GeoTIFF.
 * @param geoKeys GeoTIFF GeoKeyDirectory (optional).
 * @param cogBitmapOptions Optionale Layer-Optionen.
 * @returns Promise<Layer>
 */
export async function createReprojectedCogBitmapLayer(
  layerId: string,
  url: string,
  cogBitmapOptions?: Record<string, any>,
): Promise<Layer> {
  // 1. Dynamische Imports
  const geolibModule = await import('@gisatcz/deckgl-geolib');
  const geolib = geolibModule.default ?? geolibModule;
  const CogBitmapLayer = geolib?.CogBitmapLayer ?? geolibModule?.CogBitmapLayer;
  const [proj4, { Matrix4 }, { toProj4 }, geotiffModule] = await Promise.all([
    import('proj4'),
    import('@math.gl/core').then(mod => ({ Matrix4: mod.Matrix4 })),
    import('geotiff-geokeys-to-proj4'),
    import('geotiff'),
  ]);

  // 2. Projektion aus GeoKeys extrahieren
  let fromProjection: string = 'EPSG:4326'; // Fallback
  let bounds: [number, number, number, number] | undefined;

  try {
    const tiff = await geotiffModule.fromUrl(url);
    const image = await tiff.getImage();
    const geoKeys: GeoKeys = await image.getGeoKeys();
    const projParams: ProjectionParameters = toProj4(geoKeys!);
    fromProjection = projParams.proj4 || 'EPSG:4326';

    // Bounds aus den Metadaten extrahieren und nach EPSG:3857 transformieren
    const [minX, minY, maxX, maxY] = image.getBoundingBox();
    const corners = [
      [minX, minY],
      [maxX, maxY],
    ].map((coord: [number, number]) =>
      proj4.default(fromProjection, 'EPSG:3857', coord),
    );

    bounds = [corners[0][0], corners[0][1], corners[1][0], corners[1][1]];
  } catch (error) {
    warn(
      'Fehler beim Extrahieren der Projektion. Verwende Fallback EPSG:4326.',
      error,
    );
  }

  // 3. Web Mercator (EPSG:3857) für deck.gl definieren
  proj4.default.defs(
    'EPSG:3857',
    '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs',
  );

  // 4. Custom Layer-Klasse
  class ReprojectedCogBitmapLayer extends CogBitmapLayer {
    static layerName = 'ReprojectedCogBitmapLayer';

    constructor(props: CogBitmapLayerProps) {
      super(props);
    }

    draw(opts: any) {
      log('[deck][ReprojectedCogBitmapLayer][draw]');
      const { moduleParameters } = opts;
      const originalOnTileLoad = moduleParameters.onTileLoad;

      moduleParameters.onTileLoad = (tile: any) => {
        log(`[deck][ReprojectedCogBitmapLayer][draw][onTileLoad] ${tile}`);
        if (!tile) return originalOnTileLoad?.(tile);

        // Bounds der Kachel transformieren
        const [minX, minY, maxX, maxY] = tile.bbox;
        const corners = [
          [minX, minY],
          [maxX, minY],
          [maxX, maxY],
          [minX, maxY],
        ].map((coord: [number, number]) =>
          proj4.default(fromProjection, 'EPSG:3857', coord),
        );

        // Transformationsmatrix berechnen
        const [x1, y1] = corners[0];
        const [x2, y2] = corners[2];
        const modelMatrix = new Matrix4()
          .scale([x2 - x1, y2 - y1, 1])
          .translate([x1, y1, 0]);

        tile.modelMatrix = modelMatrix;
        return originalOnTileLoad?.(tile);
      };

      super.draw(opts);
    }
  }

  // 5. Layer-Instanz zurückgeben
  const layerInstance = new ReprojectedCogBitmapLayer({
    id: layerId,
    rasterData: url,
    bounds: bounds,
    isTiled: true,
    cogBitmapOptions: {
      type: 'image',
      useHeatMap: false,
      ...cogBitmapOptions,
    },
  });

  return layerInstance as unknown as Layer;
}
