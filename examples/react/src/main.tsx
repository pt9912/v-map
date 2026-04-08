import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// v-map is loaded via a <script type="module"> tag in index.html
// (from jsDelivr) instead of being bundled through Vite. We just wait
// for the v-map custom element to be defined before mounting React,
// so the demo can rely on the elements being upgraded immediately.
async function bootstrap() {
  await customElements.whenDefined('v-map');

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
