import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'v-map Next.js Demo',
  description: 'Reactive v-map showcase built with Next.js App Router',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        {/*
          Load v-map directly from jsDelivr at runtime instead of
          bundling it through Next.js's webpack/turbo build. Stencil's
          lazy loader uses import.meta.url to find its sibling
          *.entry.js chunks; if Next.js bundles the loader, that URL
          ends up under /_next/static/chunks/... and Stencil 404s on
          every layer chunk. Loading the published v-map.esm.js from
          jsDelivr keeps Stencil's chunk resolution intact.
        */}
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.4.0/dist/v-map/v-map.esm.js"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
