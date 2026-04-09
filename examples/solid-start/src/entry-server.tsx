// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server';

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="de">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>v-map SolidStart Demo</title>
          {/*
            Load v-map directly from jsDelivr at runtime instead of
            bundling it through Vinxi/Vite. Stencil's lazy loader uses
            import.meta.url to find its sibling *.entry.js chunks; if
            a bundler ingests the loader, that URL ends up under
            /_build/... and Stencil 404s on every layer chunk.
          */}
          <script
            type="module"
            src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.5.0/dist/v-map/v-map.esm.js"
          />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
