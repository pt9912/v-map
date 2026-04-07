import type { GeoTIFF, GeoTIFFImage } from 'geotiff';
import type { GeoKeys, ProjectionParameters } from 'geotiff-geokeys-to-proj4';
import type proj4Type from 'proj4';

import { log, warn } from '../../utils/logger';

export interface GeoTIFFSourceOptions {
  projection?: string;
  forceProjection?: boolean;
  nodata?: number;
}

export interface GeoTIFFLoaderDeps {
  geotiff: typeof import('geotiff');
  proj4: typeof proj4Type;
  geokeysToProj4: typeof import('geotiff-geokeys-to-proj4');
}

export interface GeoTIFFSource {
  tiff: GeoTIFF;
  baseImage: GeoTIFFImage;
  overviewImages: GeoTIFFImage[];
  width: number;
  height: number;
  samplesPerPixel: number;
  fromProjection: string;
  // toProjection: string;
  sourceBounds: [number, number, number, number];
  sourceRef: [number, number];
  resolution: number;
  proj4: typeof proj4Type;
  noDataValue?: number;
  wgs84Bounds: [number, number, number, number];
  transformToWgs84: (coord: [number, number]) => [number, number];
}

//const DEFAULT_TO_PROJECTION = 'EPSG:3857';

export async function loadGeoTIFFSource(
  url: string,
  options: GeoTIFFSourceOptions,
  deps: GeoTIFFLoaderDeps,
): Promise<GeoTIFFSource> {
  const { geotiff, proj4, geokeysToProj4 } = deps;
  const { fromUrl } = geotiff;
  const { toProj4 } = geokeysToProj4;

  let tiff: GeoTIFF = null;
  let lasterr = null;
  for (let i = 0; i <= 2; i++) {
    try {
      tiff = await fromUrl(url, {
        allowFullFile: true,
        blockSize: 1024 * 1024, // 1MB blocks to reduce HTTP range-request count for non-COG files
        cacheSize: 100,
      } as Parameters<typeof fromUrl>[1]);
    } catch (err) {
      lasterr = err;
    }
    if (tiff != null) {
      lasterr = null;
      break;
    }
  }
  if (lasterr != null) {
    log(lasterr);
    warn('Error - loadGeoTIFFSource - fromUrl: ', url);
    throw lasterr;
  }

  const baseImage = await tiff.getImage(0);
  const imageCount = await tiff.getImageCount();
  const overviewImages: GeoTIFFImage[] = [];
  for (let i = 1; i < imageCount; i++) {
    overviewImages.push(await tiff.getImage(i));
  }

  const width = baseImage.getWidth();
  const height = baseImage.getHeight();
  const samplesPerPixel = Math.max(1, baseImage.getSamplesPerPixel?.() ?? 1);

  let fromProjection =
    options.forceProjection && options.projection
      ? options.projection
      : options.projection ?? 'EPSG:4326';
  let proj4String: string | null = null;

  if (!options.forceProjection) {
    const geoKeys: Partial<GeoKeys> | null =
      typeof baseImage.getGeoKeys === 'function'
        ? baseImage.getGeoKeys() ?? null
        : null;

    if (geoKeys) {
      try {
        const projParams: ProjectionParameters = toProj4(geoKeys as GeoKeys);
        const epsg =
          geoKeys.ProjectedCSTypeGeoKey ?? geoKeys.GeographicTypeGeoKey;
        if (epsg) {
          fromProjection = `EPSG:${epsg}`;
        }
        if (projParams?.proj4) {
          proj4String = projParams.proj4;
          const numericCode = String(epsg);
          if (epsg && !proj4.defs(fromProjection)) {
            proj4.defs(fromProjection, projParams.proj4);
          }
          if (epsg && !proj4.defs(numericCode)) {
            proj4.defs(numericCode, projParams.proj4);
          }
        }
      } catch (err) {
        warn('v-map - geotiff - failed to parse GeoKeys', err);
      }
    }
  }

  if (!proj4String) {
    switch (fromProjection) {
      case 'EPSG:4326':
        proj4String = '+proj=longlat +datum=WGS84 +no_defs';
        break;
      case 'EPSG:3857':
        proj4String =
          '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs';
        break;
      case 'EPSG:32632':
        proj4String = '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs';
        break;
    }
  }

  if (!fromProjection || fromProjection.trim() === '') {
    fromProjection = 'EPSG:4326';
  }

  if (proj4String && !proj4.defs(fromProjection)) {
    proj4.defs(fromProjection, proj4String);
  }

  const sourceBounds = baseImage.getBoundingBox() as [
    number,
    number,
    number,
    number,
  ];
  const sourceRef: [number, number] = [sourceBounds[0], sourceBounds[1]];
  const resolution = baseImage.getResolution()[0];

  const rawNoData =
    options.nodata !== undefined && options.nodata !== null
      ? Number(options.nodata)
      : typeof baseImage.getGDALNoData === 'function'
      ? baseImage.getGDALNoData()
      : undefined;
  const noDataValue =
    rawNoData !== undefined && rawNoData !== null
      ? Number(rawNoData)
      : undefined;

  const clampLon = (lon: number) =>
    Math.max(-180, Math.min(180, Number.isFinite(lon) ? lon : 0));
  const clampLat = (lat: number) =>
    Math.max(-90, Math.min(90, Number.isFinite(lat) ? lat : 0));

  let transformToWgs84: (coord: [number, number]) => [number, number];
  if (!fromProjection || fromProjection === 'EPSG:4326') {
    transformToWgs84 = coord => coord;
  } else {
    transformToWgs84 = (coord: [number, number]) => {
      try {
        const result = proj4(fromProjection, 'EPSG:4326', coord);
        return [Number(result[0]), Number(result[1])];
      } catch (err) {
        warn('v-map - geotiff - transform to WGS84 failed, falling back', err);
        return coord;
      }
    };
  }

  const [minX, minY, maxX, maxY] = sourceBounds;
  const corners = [
    transformToWgs84([minX, minY]),
    transformToWgs84([maxX, minY]),
    transformToWgs84([maxX, maxY]),
    transformToWgs84([minX, maxY]),
  ];

  const west = clampLon(Math.min(...corners.map(c => c[0])));
  const east = clampLon(Math.max(...corners.map(c => c[0])));
  const south = clampLat(Math.min(...corners.map(c => c[1])));
  const north = clampLat(Math.max(...corners.map(c => c[1])));

  log('v-map - geotiff - loaded source', {
    url,
    width,
    height,
    samplesPerPixel,
    fromProjection,
    bounds: sourceBounds,
  });

  return {
    tiff,
    baseImage,
    overviewImages,
    width,
    height,
    samplesPerPixel,
    fromProjection,
    //toProjection: DEFAULT_TO_PROJECTION,
    sourceBounds,
    sourceRef,
    resolution,
    proj4,
    noDataValue,
    wgs84Bounds: [west, south, east, north],
    transformToWgs84,
  };
}

export async function getGeoTIFFSource(
  url: string,
  projection: string,
  forceProjection: boolean,
  nodata: number,
): Promise<GeoTIFFSource> {
  const [geotiffModule, { default: proj4 }, geokeysModule] = await Promise.all([
    import('geotiff'),
    import('proj4'),
    import('geotiff-geokeys-to-proj4'),
  ]);

  const source: GeoTIFFSource = await loadGeoTIFFSource(
    url,
    {
      projection: projection,
      forceProjection: forceProjection,
      nodata: nodata,
    },
    {
      geotiff: geotiffModule,
      proj4,
      geokeysToProj4: geokeysModule,
    },
  );
  return source;
}
