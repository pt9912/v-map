export interface ILayer {
  getOptions(): Record<string, unknown>;
  setOptions(options: Record<string, unknown>): void;
  getVisible(): boolean;
  setVisible(value: boolean): void;
  getOpacity(): number;
  setOpacity(value: number): void;
  getZIndex(): number;
  setZIndex(zIndex: number): Promise<void>;
  remove(): void;
}
