// src/types/vite-raw.d.ts
declare module '*.md?raw' {
  const content: string;
  export default content;
}
declare module '*.md' {
  const content: string; // falls du mal ohne ?raw importierst
  export default content;
}
