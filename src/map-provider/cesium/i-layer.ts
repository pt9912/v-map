export interface ILayer {
  getOptions(): any;
  setOptions(options: any): void;
  getVisible(): boolean;
  setVisible(value: boolean): void;
  getOpacity(): number;
  setOpacity(value: number): void;
  getZIndex(): number;
  setZIndex(zIndex: number): Promise<void>;
  remove(): void;
}
