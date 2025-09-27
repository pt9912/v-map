import type {
  Viewer,
  Cesium3DTileset,
  ImageryLayer,
  DataSource,
  Color,
  Cesium3DTileStyle,
  GeoJsonDataSource,
  ImageryLayerCollection,
  DataSourceCollection,
  Property,
  Entity,
  PrimitiveCollection,
  //Primitive,
} from 'cesium';

//import { AsyncMutex } from '../../utils/async-mutex';

import { ILayer } from './i-layer';

interface CesiumCollection<T> {
  remove(element: T, destroy?: boolean): boolean;
  get(index: number): T | undefined;
  readonly length: number;
}

interface I3DTilesLayer extends ILayer {
  setColor(color: string | Color, opacity?: number): void;
  setStyle(style: Cesium3DTileStyle | { [key: string]: any }): void;
}

type CesiumModule = typeof import('cesium');

export class LayerManager {
  private Cesium: CesiumModule;
  private layers = new Map<string, ILayer | I3DTilesLayer>();
  private viewer: Viewer;
  //private imageryZMutex = new AsyncMutex();

  constructor(Cesium: CesiumModule, viewer: Viewer) {
    this.viewer = viewer;
    this.Cesium = Cesium;
  }

  replaceLayer<
    T extends GeoJsonDataSource | DataSource | Cesium3DTileset | ImageryLayer,
  >(
    id: string,
    oldlayer: ILayer | I3DTilesLayer,
    layer: T,
  ): ILayer | I3DTilesLayer {
    if (!this.Cesium) {
      throw new Error('Cesium must be initialized first. Call init() method.');
    }

    const zIndex = oldlayer.getZIndex();
    const visible = oldlayer.getVisible();
    const opacity = oldlayer.getOpacity();

    this.removeLayer(id);

    const wrappedLayer = this.addLayer(id, layer);
    wrappedLayer.setZIndex(zIndex);
    wrappedLayer.setVisible(visible);
    wrappedLayer.setOpacity(opacity);
    return wrappedLayer;
  }

  addLayer<
    T extends GeoJsonDataSource | DataSource | Cesium3DTileset | ImageryLayer,
  >(id: string, layer: T): ILayer | I3DTilesLayer {
    if (!this.Cesium) {
      throw new Error('Cesium must be initialized first. Call init() method.');
    }

    //add layer
    if (layer instanceof this.Cesium.GeoJsonDataSource) {
      this.viewer.dataSources.add(layer);
    } else if (layer instanceof this.Cesium.DataSource) {
      this.viewer.dataSources.add(layer);
    } else if (layer instanceof this.Cesium.Cesium3DTileset) {
      this.viewer.scene.primitives.add(layer);
      if (!layer.style) {
        layer.style = new this.Cesium.Cesium3DTileStyle();
      }
    } else if (layer instanceof this.Cesium.ImageryLayer) {
      this.viewer.imageryLayers.add(layer);
    }

    (layer as any).id = id;
    const wrapped = this.wrapLayer(layer);
    this.layers.set(id, wrapped);
    return wrapped;
  }

  getLayer(layerId: string): ILayer | I3DTilesLayer {
    const layer = this.layers.get(layerId);
    if (!layer) throw new Error(`Layer mit ID "${layerId}" nicht gefunden.`);
    return layer;
  }

  getLayerById(layerId: string): ILayer | I3DTilesLayer {
    return this.getLayer(layerId);
  }

  removeLayer(layerId: string): void {
    const layer = this.getLayer(layerId);
    layer.remove();
    this.layers.delete(layerId);
  }

  setVisible(layerId: string, visible: boolean): void {
    const layer = this.getLayer(layerId);
    layer.setVisible(visible);
  }

  setOpacity(layerId: string, opacity: number): void {
    const layer = this.getLayer(layerId);
    layer.setOpacity(opacity);
  }

  setZIndex(layerId: string, zindex: number): void {
    const layer = this.getLayer(layerId);
    layer.setZIndex(zindex);
  }

  private wrapLayer(layer: any): ILayer | I3DTilesLayer {
    if (layer instanceof this.Cesium.ImageryLayer) {
      return this.wrapImageryLayer(layer);
    } else if (layer instanceof this.Cesium.Cesium3DTileset) {
      return this.wrapTilesetLayer(layer);
    } else {
      return this.wrapDataSourceLayer(layer);
    }
  }

  private async sortImageryLayers(
    collection: ImageryLayerCollection,
    layer: ImageryLayer,
    targetZ: number,
  ): Promise<void> {
    const tempCollection: ImageryLayer[] = this.sort(
      collection,
      layer,
      targetZ,
    );
    // Collection leeren und neu befüllen
    collection.removeAll(false);
    tempCollection.forEach(ds => collection.add(ds));
  }

  private async sort3DTileSets(
    collection: PrimitiveCollection,
    tileset: Cesium3DTileset,
    targetZ: number,
  ): Promise<void> {
    const tempCollection: ImageryLayer[] = this.sort(
      collection,
      tileset,
      targetZ,
    );
    // Collection leeren und neu befüllen
    collection.removeAll();
    tempCollection.forEach(ds => collection.add(ds));
  }

  private async sortDataSources(
    collection: DataSourceCollection,
    dataSource: DataSource,
    zIndex: number,
  ): Promise<void> {
    const tempCollection: DataSource[] = this.sort(
      collection,
      dataSource,
      zIndex,
    );
    // Collection leeren und neu befüllen
    collection.removeAll(false);
    tempCollection.forEach(async ds => await collection.add(ds));
  }

  private sort<T>(
    collection: CesiumCollection<T>,
    dataSource: T,
    zIndex: number,
  ): T[] {
    // 1. Layer entfernen
    collection.remove(dataSource, false);

    // 2. Layer an der richtigen Position wieder hinzufügen
    // Cesium hat keine direkte "setZIndex"-Methode für DataSources,
    // also müssen wir die Reihenfolge manuell steuern.
    // Da DataSourceCollection keine Z-Index-Unterstützung hat,
    // müssen wir alle Layer neu sortieren.
    //    const dataSources: DataSource[] = [];
    const tempDataSources: T[] = [];

    // Alle Layer sammeln
    for (let i = 0; i < collection.length; i++) {
      tempDataSources.push(collection.get(i));
    }

    // Sortieren nach zIndex (falls vorhanden) oder Reihenfolge
    tempDataSources.sort((a, b) => {
      const aZIndex = (a as any).zIndex || 0;
      const bZIndex = (b as any).zIndex || 0;
      return aZIndex - bZIndex;
    });

    // Den Layer mit dem neuen zIndex einfügen
    (dataSource as any).zIndex = zIndex;
    tempDataSources.push(dataSource);

    // Neu sortieren
    tempDataSources.sort((a, b) => {
      const aZIndex = (a as any).zIndex || 0;
      const bZIndex = (b as any).zIndex || 0;
      return aZIndex - bZIndex;
    });

    return tempDataSources;
  }

  // /**
  //  * Verschiebt ein bereits vorhandenes ImageryLayer innerhalb seiner Collection
  //  * zu einem gewünschten zIndex und hält die Collection nach zIndex sortiert.
  //  *
  //  * @param collection  Die Sammlung, in der sich das Layer befindet.
  //  * @param layer       Das zu verschiebende Layer (ist bereits Teil der Collection).
  //  * @param targetZ     Der gewünschte neue zIndex.
  //  */
  // private moveImageryLayerToZIndex(
  //   collection: ImageryLayerCollection,
  //   layer: ImageryLayer,
  //   targetZ: number,
  // ): void {
  //   // fire-and-forget; Thread-Sicherheit via Mutex
  //   void this.imageryZMutex.runExclusive(async () => {
  //     // -------------------------------------------------
  //     // 1️⃣  Neues zIndex setzen (überschreibt das alte)
  //     // -------------------------------------------------
  //     (layer as any).zIndex = targetZ;

  //     // -------------------------------------------------
  //     // 2️⃣  Aktuelle Position bestimmen
  //     // -------------------------------------------------
  //     const curIdx = collection.indexOf(layer);
  //     if (curIdx === -1) {
  //       throw new Error('Der übergebene Layer ist nicht Teil der Collection.');
  //     }

  //     // -------------------------------------------------
  //     // 3️⃣  Nach oben schieben, solange Vorgänger einen
  //     //     größeren zIndex hat (stabile Sortierung)
  //     // -------------------------------------------------
  //     let idx = curIdx;
  //     while (
  //       idx > 0 && // nicht am Anfang
  //       collection[idx - 1].zIndex > targetZ // Vorgänger hat höheren zIndex
  //     ) {
  //       // `raise` vertauscht das aktuelle Element mit seinem Vorgänger
  //       collection.raise(collection[idx]);
  //       idx--;
  //     }

  //     // -------------------------------------------------
  //     // 4️⃣  Nach unten schieben, falls das neue zIndex
  //     //     größer ist als das der nachfolgenden Elemente
  //     // -------------------------------------------------
  //     while (
  //       idx < collection.length - 1 && // nicht am Ende
  //       collection[idx + 1].zIndex < targetZ // Nachfolger hat kleineren zIndex
  //     ) {
  //       // `lower` vertauscht das aktuelle Element mit seinem Nachfolger
  //       collection.lower(collection[idx]);
  //       idx++;
  //     }
  //   });
  //   // -------------------------------------------------
  //   // 5️⃣  Optional: Guard‑Clause für extreme Werte
  //   // -------------------------------------------------
  //   // (Falls du Min/Max‑Grenzen definieren willst)
  //   // if (targetZ < MIN_Z) (layer as any).zIndex = MIN_Z;
  //   // if (targetZ > MAX_Z) (layer as any).zIndex = MAX_Z;
  // }

  // private moveTilesetToIndex(tileset: Cesium3DTileset, index: number): void {
  //   const primitives = this.viewer.scene.primitives;
  //   primitives.remove(tileset);
  //   if (index >= primitives.length) {
  //     primitives.add(tileset);
  //   } else {
  //     const tilesets = [];
  //     for (let i = 0; i < primitives.length; i++) {
  //       const current = primitives.get(i);
  //       if (i === index) tilesets.push(tileset);
  //       if (current !== tileset) tilesets.push(current);
  //     }
  //     primitives.removeAll();
  //     tilesets.forEach(t => primitives.add(t));
  //   }
  // }

  // private moveDataSourceToIndex(
  //   collection: DataSourceCollection,
  //   dataSource: DataSource,
  //   zIndex: number,
  // ): void {
  //   // 1. Layer entfernen
  //   collection.remove(dataSource);

  //   // 2. Layer an der richtigen Position wieder hinzufügen
  //   // Cesium hat keine direkte "setZIndex"-Methode für DataSources,
  //   // also müssen wir die Reihenfolge manuell steuern.
  //   // Da DataSourceCollection keine Z-Index-Unterstützung hat,
  //   // müssen wir alle Layer neu sortieren.
  //   //    const dataSources: DataSource[] = [];
  //   const tempDataSources: DataSource[] = [];

  //   // Alle Layer sammeln
  //   for (let i = 0; i < collection.length; i++) {
  //     tempDataSources.push(collection.get(i));
  //   }

  //   // Sortieren nach zIndex (falls vorhanden) oder Reihenfolge
  //   tempDataSources.sort((a, b) => {
  //     const aZIndex = (a as any).zIndex || 0;
  //     const bZIndex = (b as any).zIndex || 0;
  //     return aZIndex - bZIndex;
  //   });

  //   // Den Layer mit dem neuen zIndex einfügen
  //   (dataSource as any).zIndex = zIndex;
  //   tempDataSources.push(dataSource);

  //   // Neu sortieren
  //   tempDataSources.sort((a, b) => {
  //     const aZIndex = (a as any).zIndex || 0;
  //     const bZIndex = (b as any).zIndex || 0;
  //     return aZIndex - bZIndex;
  //   });

  //   // Collection leeren und neu befüllen
  //   collection.removeAll();
  //   tempDataSources.forEach(ds => collection.add(ds));
  // }

  private wrapImageryLayer(layer: ImageryLayer): ILayer {
    const collection = this.viewer.imageryLayers;
    let iLOptions: any = {};
    return {
      getOptions: () => {
        return iLOptions;
      },
      setOptions(options: any): void {
        iLOptions = options;
      },
      getVisible: () => {
        return layer.show;
      },
      setVisible: (value: boolean) => {
        layer.show = value;
      },
      getOpacity: () => layer.alpha,
      setOpacity: (value: number) => {
        layer.alpha = value;
      },
      getZIndex: () => {
        for (let i = 0; i < collection.length; i++) {
          if (collection.get(i) === layer) return i;
        }
        return -1;
      },
      setZIndex: async (zIndex: number): Promise<void> => {
        if (zIndex !== undefined) {
          await this.sortImageryLayers(collection, layer, zIndex);
        }
      },
      remove: () => collection.remove(layer),
    };
  }

  private wrapTilesetLayer(layer: Cesium3DTileset): I3DTilesLayer {
    const collection = this.viewer.scene.primitives;
    let c3dTSOptions: any = {};
    return {
      getOptions: () => {
        return c3dTSOptions;
      },
      setOptions(options: any): void {
        c3dTSOptions = options;
      },
      getVisible: () => {
        return layer.show;
      },
      setVisible: (value: boolean) => {
        layer.show = value;
      },
      getOpacity: () => {
        const style = layer.style;
        if (style.color && typeof style.color === 'string') {
          const colorStr = style.color as string;
          const match = colorStr.match(/color\(.*?,([\d.]+)\)/);
          return match ? parseFloat(match[1]) : 1.0;
        }
        return 1.0;
      },
      setOpacity: (value: number) => {
        const currentColor = layer.style.color;
        let colorExpr: string;

        if (typeof currentColor === 'string') {
          const colorStr = currentColor as string;
          const colorPart = colorStr.replace(
            /color\((.*?),[\d.]+\)/,
            `color($1, ${value})`,
          );
          colorExpr = colorPart.includes('color')
            ? colorPart
            : `color('white', ${value})`;
        } else {
          colorExpr = `color('white', ${value})`;
        }

        layer.style = new this.Cesium.Cesium3DTileStyle({
          color: colorExpr,
          colorBlendMode: this.Cesium.ColorBlendMode.MIX,
        });
      },
      getZIndex: () => {
        const primitives = this.viewer.scene.primitives;
        for (let i = 0; i < primitives.length; i++) {
          if (primitives.get(i) === layer) return i;
        }
        return -1;
      },
      setZIndex: async (zIndex: number): Promise<void> => {
        if (zIndex !== undefined) {
          this.sort3DTileSets(collection, layer, zIndex);
          //this.moveTilesetToIndex(layer, zIndex);
        }
      },
      setColor: (color: string | Color, opacity: number = 1.0) => {
        const cssColor =
          color instanceof this.Cesium.Color
            ? (color as Color).toCssHexString()
            : (color as string).replace(/[#\s]/g, '');
        layer.style = new this.Cesium.Cesium3DTileStyle({
          color: `color('${cssColor}', ${opacity})`,
          colorBlendMode: this.Cesium.ColorBlendMode.MIX,
        });
      },
      setStyle: (style: Cesium3DTileStyle | { [key: string]: any }) => {
        layer.style =
          style instanceof this.Cesium.Cesium3DTileStyle
            ? style
            : new this.Cesium.Cesium3DTileStyle(style);
      },
      remove: () => this.viewer.scene.primitives.remove(layer),
    };
  }

  private wrapDataSourceLayer(layer: DataSource): ILayer {
    const collection = this.viewer.dataSources;
    let dsOptions: any = {};
    return {
      getOptions: () => {
        return dsOptions;
      },
      setOptions(options: any): void {
        dsOptions = options;
      },
      getVisible: () => {
        return layer.show;
      },
      setVisible: (value: boolean) => {
        layer.show = value;
      },
      getOpacity: () => 1.0, //todo
      setOpacity: (value: number) => {
        layer.entities.values.forEach((entity: Entity) => {
          // Helper-Funktion zum Setzen der Opacity
          const setColorOpacity = (
            colorProperty: Property | Color | undefined,
            defaultColor: Color,
          ) => {
            if (!colorProperty) return defaultColor.withAlpha(value);

            // Falls es ein Property-Objekt ist (z. B. ColorProperty, ConstantProperty)
            if (colorProperty instanceof Cesium.Property) {
              const currentColor =
                colorProperty.getValue(new Cesium.JulianDate()) || defaultColor;
              return currentColor.withAlpha(value);
            }
            // Falls es ein Color-Objekt ist
            else if (colorProperty instanceof Cesium.Color) {
              return colorProperty.withAlpha(value);
            }
            // Fallback
            else {
              return defaultColor.withAlpha(value);
            }
          };

          // Polygone
          if (entity.polygon) {
            const material = entity.polygon.material;
            if (material instanceof Cesium.ColorMaterialProperty) {
              const color = material.color;
              material.color = setColorOpacity(color, Cesium.Color.WHITE);
            } else if (material instanceof Cesium.ImageMaterialProperty) {
              material.color = setColorOpacity(
                material.color,
                Cesium.Color.WHITE,
              );
            }
          }

          // Polylinien
          if (entity.polyline) {
            const material = entity.polyline.material;
            if (material instanceof Cesium.ColorMaterialProperty) {
              material.color = setColorOpacity(
                material.color,
                Cesium.Color.WHITE,
              );
            } else if (
              material instanceof Cesium.PolylineOutlineMaterialProperty
            ) {
              material.color = setColorOpacity(
                material.color,
                Cesium.Color.WHITE,
              );
            }
          }

          // Punkte
          if (entity.point) {
            entity.point.color = setColorOpacity(
              entity.point.color,
              Cesium.Color.WHITE,
            );
          }

          // Billboards
          if (entity.billboard) {
            entity.billboard.color = setColorOpacity(
              entity.billboard.color,
              Cesium.Color.WHITE,
            );
          }

          // Labels
          if (entity.label) {
            entity.label.fillColor = setColorOpacity(
              entity.label.fillColor,
              Cesium.Color.BLACK,
            );
            if (entity.label.outlineColor) {
              entity.label.outlineColor = setColorOpacity(
                entity.label.outlineColor,
                Cesium.Color.BLACK,
              );
            }
          }

          // 3D-Modelle (falls vorhanden)
          if (entity.model) {
            entity.model.color = setColorOpacity(
              entity.model.color,
              Cesium.Color.WHITE,
            );
          }
        });
      },
      getZIndex: () => {
        for (let i = 0; i < collection.length; i++) {
          if (collection.get(i) === layer) return i;
        }
        return -1;
      },
      setZIndex: async (zIndex: number): Promise<void> => {
        if (zIndex !== undefined) {
          await this.sortDataSources(collection, layer, zIndex);
        }
      },
      remove: () => collection.remove(layer),
    };
  }
}
