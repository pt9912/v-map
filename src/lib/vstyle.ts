// src/lib/vstyle.ts
export type Color = string | [number, number, number, number?];
export type Expr<T=any> = T | any[];

export type VStyleRule = {
  when?: Expr<boolean>;
  point?: {
    radius?: Expr<number>;
    fill?: Expr<Color>;
    stroke?: { color?: Expr<Color>; width?: Expr<number> };
    icon?: { url: string; size?: number; anchor?: [number,number] };
  };
  line?: { color?: Expr<Color>; width?: Expr<number>; dasharray?: number[]; };
  polygon?: { fill?: Expr<Color>; stroke?: { color?: Expr<Color>; width?: Expr<number> } };
  label?: { text?: Expr<string>; color?: Expr<Color>; size?: Expr<number>; halo?: { color?: Expr<Color>; width?: Expr<number> } };
};

export type VStyle = { rules: VStyleRule[]; vars?: Record<string, Color|number|string>; };

export const VSTYLE_DEFAULT: VStyle = {
  rules: [
    { polygon: { fill: 'rgba(0,120,255,0.15)', stroke: { color:'#0971fe', width:1 } } },
    { line: { color: '#0971fe', width: ['interpolate','linear',['zoom'], 4,1, 10,3] } },
    { point: { radius: ['interpolate','linear',['zoom'], 4,3, 10,6], fill:'#0971fe', stroke:{ color:'#fff', width:1 } } },
    { label: { text: ['get','name'], color:'#111', size:['interpolate','linear',['zoom'], 4,11, 10,14], halo:{ color:'#fff', width:2 } } },
  ]
};
