import { clientOnly } from '@solidjs/start';

// v-map needs the browser DOM (customElements, document, window).
// Use clientOnly to skip SSR for the showcase component so the
// prerender pass produces an empty shell that hydrates client-side.
const Showcase = clientOnly(() => import('~/components/Showcase'));

export default function Home() {
  return <Showcase />;
}
