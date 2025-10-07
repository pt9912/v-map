import { Component, Prop, State, h, Element } from '@stencil/core';
//import { forceUpdate } from '@stencil/core';

type ElementInfo = {
  id: string;
  element: HTMLElement;
  visible: boolean;
  opacity: number;
  zIndex: number;
};

type LayerInfo = {
  info: ElementInfo;
  label: string;
};

@Component({
  tag: 'v-map-layercontrol',
  styleUrl: 'v-map-layercontrol.css',
  shadow: true,
})
export class VMapLayerControl {
  /** ID der zu steuernden Karte (DOM-Element mit dieser id) */
  @Prop() for: string;

  @Element() host!: HTMLElement;

  @State() layerGroups: Array<{
    info: ElementInfo;
    label: string;
    groupTitle: string;
    basemapid?: string;
    layers: Array<LayerInfo>;
  }> = [];

  private observer?: MutationObserver;
  private mapElement: HTMLElement | null = null;

  // ---- Lifecycle -----------------------------------------------------------

  async connectedCallback() {
    //this.findMapElement();
  }

  async componentWillLoad() {
    this.findMapElement();
  }

  async disconnectedCallback() {
    this.observer?.disconnect();
  }

  // ---- DOM-Discovery/Observation ------------------------------------------

  private findMapElement() {
    this.mapElement = document.getElementById(this.for);
    if (this.mapElement) {
      this.initObserver();
      this.updateLayerGroupsFromDom();
      //      this.updateLayersFromDom();
    } else {
      // Karte noch nicht da – später erneut versuchen
      setTimeout(() => this.findMapElement(), 100);
    }
  }

  private initObserver() {
    if (!this.mapElement) return;
    this.observer = new MutationObserver(async () => {
      this.updateLayerGroupsFromDom();
      //this.updateLayersFromDom();
    });
    this.observer.observe(this.mapElement, {
      childList: true,
      subtree: true,
      // WICHTIG: Attribute lauschen, sonst werden UI-Änderungen nicht gespiegelt
      attributes: true,
      attributeFilter: ['basemapid', 'visible', 'opacity', 'zindex'],
    });
  }

  // ---- Layer-Extraktion ----------------------------------------------------

  private readBool(el: HTMLElement, prop: string, ...attrs: string[]) {
    const anyEl = el as any;
    if (typeof anyEl[prop] === 'boolean') return !!anyEl[prop];
    for (const a of attrs) if (el.hasAttribute(a)) return true;
    return false;
  }

  private readNumber(
    el: HTMLElement,
    prop: string,
    def: number,
    ...attrs: string[]
  ) {
    const anyEl = el as any;
    const v = anyEl[prop];
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    for (const a of attrs) {
      const s = el.getAttribute(a);
      if (s != null && s !== '') {
        const n = Number(s);
        if (!Number.isNaN(n)) return n;
      }
    }
    return def;
  }

  private readString(
    el: HTMLElement,
    prop: string,
    def: string,
    ...attrs: string[]
  ) {
    const anyEl = el as any;
    const v = anyEl[prop];
    if (typeof v === 'string' && v.length) return v;
    for (const a of attrs) {
      const s = el.getAttribute(a);
      if (s) return s;
    }
    return def;
  }

  private updateLayerGroupsFromDom() {
    if (!this.mapElement) return;

    const sel = 'v-map-layergroup';
    const layerGroupElements = Array.from(
      this.mapElement.querySelectorAll<HTMLElement>(sel),
    );

    //await customElements.whenDefined('v-map-layercontrol');

    this.layerGroups = layerGroupElements.map((groupElement, _idx) => {
      // groupId: existiert als Attr/Prop? Sonst generieren, aber direkt setzen, damit stabil bleibt
      let id = groupElement.id;
      if (!id) {
        id = `auto-${Math.random().toString(36).slice(2, 9)}`;
        groupElement.id = id;
      }

      const label = this.readString(groupElement, 'label', id, 'label');
      // const type =
      //   (this.readString(
      //     groupElement,
      //     'type',
      //     'overlay',
      //     'type',
      //   ) as LayerType) ?? 'overlay';

      const groupTitle = groupElement?.getAttribute('group-title') || undefined;
      //const groupId = groupElement?.getAttribute('groupid') || undefined;
      const visible = this.readBool(groupElement, 'visible', 'visible');
      //      const zIndex = this.readNumber(element, 'zIndex', 0, 'zindex');
      const basemapid = groupElement.getAttribute('basemapid');
      const layers = this.getLayersFromDom(groupElement);
      return {
        info: {
          element: groupElement,
          id,
          visible,
          opacity: undefined,
          zIndex: undefined,
        },
        label,
        //type,
        groupTitle,
        //groupId,
        basemapid,
        layers,
      };
    });

    this.layerGroups = this.cloneLayerGroups();
    //forceUpdate(this.host);
  }

  private cloneLayerGroups(): typeof this.layerGroups {
    return this.layerGroups.map(group => ({
      ...group,
      info: { ...group.info }, // Neue Referenz für info
      layers: group.layers.map(layer => ({
        ...layer,
        info: { ...layer.info }, // Neue Referenz für layer.info
      })),
    }));
  }

  private getLayersFromDom(groupElement: HTMLElement): Array<LayerInfo> {
    if (!groupElement) return;

    const sel =
      'v-map-layer-wms, v-map-layer-osm, v-map-layer-geotiff, v-map-layer-geojson';
    const layerElements = Array.from(
      groupElement.querySelectorAll<HTMLElement>(sel),
    );

    const layers = layerElements.map((element, _idx) => {
      // id: existiert als Attr/Prop? Sonst generieren, aber direkt setzen, damit stabil bleibt
      let id = element.id;
      if (!id) {
        id = `auto-${Math.random().toString(36).slice(2, 9)}`;
        element.id = id;
      }

      const label = this.readString(element, 'label', id, 'label');
      // const type =
      //   (this.readString(element, 'type', 'overlay', 'type') as LayerType) ??
      //   'overlay';
      //const groupElement = element.closest('v-map-layergroup');
      //const group = groupElement?.getAttribute('group-title') || undefined;
      //const groupId = groupElement?.getAttribute('groupid') || undefined;
      const visible = this.readBool(element, 'visible', 'visible');
      const opacity = this.readNumber(element, 'opacity', 1, 'opacity');
      //const zIndex = this.readNumber(element, 'zIndex', 0, 'z-index', 'zindex');
      const zIndex = this.readNumber(element, 'zIndex', 0, 'zindex');

      //const groupId = groupElement.id;
      return {
        info: {
          element,
          id,
          visible,
          opacity,
          zIndex,
        },
        label,
        //type,
      };
    });
    return layers;
  }

  private setBool(
    el: HTMLElement,
    prop: string,
    val: boolean,
    ...attrs: string[]
  ) {
    (el as any)[prop] = val;
    for (const a of attrs) {
      if (val) el.setAttribute(a, '');
      else el.removeAttribute(a);
    }
  }

  private setNumber(
    el: HTMLElement,
    prop: string,
    val: number,
    ...attrs: string[]
  ) {
    (el as any)[prop] = val;
    for (const a of attrs) el.setAttribute(a, String(val));
  }

  // Sichtbarkeit eines Layers ändern
  private handleVisibilityChange(info: ElementInfo, visible: boolean) {
    if (!info.element) return;
    this.setBool(info.element, 'visible', visible, 'visible');
    info.visible = visible;
    // UI aktualisieren
    this.layerGroups = [...this.layerGroups];
  }

  private handleOpacityChange(info: ElementInfo, opacity: number) {
    if (!info.element) return;
    this.setNumber(info.element, 'opacity', opacity, 'opacity');
    info.opacity = opacity;
    // UI aktualisieren
    this.layerGroups = [...this.layerGroups];
  }

  private handleZIndexChange(info: ElementInfo, zIndex: number) {
    if (!info.element) return;
    this.setNumber(info.element, 'zIndex', zIndex, 'z-index', 'zindex');
    info.zIndex = zIndex;
    // UI aktualisieren
    this.layerGroups = [...this.layerGroups];
  }

  private handleBaseLayerChange(group: any, newBaseLayerId: string) {
    // basemapid aktualisieren
    group.basemapid = newBaseLayerId;
    group.info.element.setAttribute('basemapid', newBaseLayerId);

    // UI aktualisieren
    this.layerGroups = [...this.layerGroups];
  }

  // ---- Render --------------------------------------------------------------

  render() {
    if (this.layerGroups.length === 0) {
      return <div class="layer-control-empty">Keine Layer verfügbar</div>;
    }

    return (
      <div class="layer-control">
        {this.layerGroups.map(group => {
          return (
            <details key={group.info.id} class="layer-group">
              <summary class="layer-group-header">
                <input
                  type="checkbox"
                  checked={group.info.visible}
                  onChange={e => {
                    const visible = (e.target as HTMLInputElement).checked;
                    this.handleVisibilityChange(group.info, visible);
                  }}
                  class="layer-group-checkbox"
                />
                <span class="layer-group-title">{group.groupTitle}</span>
                {group.basemapid !== null ? (
                  <>
                    <select
                      class="basemap-selector"
                      onChange={e =>
                        this.handleBaseLayerChange(
                          group,
                          (e.target as HTMLSelectElement).value,
                        )
                      }
                    >
                      {group.layers.map(layer => (
                        <option
                          key={layer.info.id}
                          value={layer.info.id}
                          selected={group.basemapid === layer.info.id} // <-- Fix: `selected` statt `value`
                        >
                          {layer.label}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <div></div>
                )}
              </summary>

              <div class="layer-group-content">
                {group.layers.map(layer => (
                  <div key={layer.info.id} class="layer-item">
                    <label class="layer-item-label" title={layer.label}>
                      <input
                        name={`group-${group.info.id}`}
                        type="checkbox"
                        checked={layer.info.visible}
                        onChange={e =>
                          this.handleVisibilityChange(
                            layer.info,
                            (e.target as HTMLInputElement).checked,
                          )
                        }
                        class="layer-item-checkbox"
                      />
                      <span class="layer-item-title">{layer.label}</span>
                    </label>

                    <div class="layer-item-controls">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={String(layer.info.opacity)}
                        onInput={e =>
                          this.handleOpacityChange(
                            layer.info,
                            parseFloat((e.target as HTMLInputElement).value),
                          )
                        }
                        class="layer-item-opacity"
                        aria-label={`Opacity ${layer.label}`}
                      />
                      <input
                        type="number"
                        min="0"
                        value={String(layer.info.zIndex)}
                        onChange={e =>
                          this.handleZIndexChange(
                            layer.info,
                            parseInt(
                              (e.target as HTMLInputElement).value,
                              10,
                            ) || 0,
                          )
                        }
                        class="layer-item-zindex"
                        aria-label={`Z-Index ${layer.label}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    );
  }
}
