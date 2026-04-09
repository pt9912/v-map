// @refresh reload
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';

// Vite replaces import.meta.env.BASE_URL at build time with the
// `base` value from app.config.ts. The SolidJS Router needs this as
// its `base` prop so it can strip the prefix from the URL before
// matching routes. Without it, `/v-map/demos/solid-start/` can't
// match the `/` route and the page stays blank.
const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

export default function App() {
  return (
    <Router
      base={base}
      root={props => <Suspense>{props.children}</Suspense>}
    >
      <FileRoutes />
    </Router>
  );
}
