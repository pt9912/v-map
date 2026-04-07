import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { AddressInfo } from 'node:net';

export interface GeoTiffTestServer {
  close: () => Promise<void>;
  url: string;
}

function writeCorsHeaders(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Expose-Headers', 'Accept-Ranges, Content-Length, Content-Range, Content-Type');
}

function parseRangeHeader(rangeHeader: string, size: number) {
  const match = /^bytes=(\d+)-(\d+)?$/.exec(rangeHeader);
  if (!match) return null;

  const start = Number.parseInt(match[1], 10);
  const requestedEnd =
    match[2] !== undefined ? Number.parseInt(match[2], 10) : size - 1;
  const end = Math.min(requestedEnd, size - 1);

  if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= size) {
    return null;
  }

  return { start, end };
}

function getPathname(req: IncomingMessage) {
  return new URL(req.url ?? '/', 'http://127.0.0.1').pathname;
}

export async function startGeoTiffTestServer(
  fixturePath = path.resolve(process.cwd(), 'public/geotiff/cea.tif'),
  route = '/geotiff/cea.tif',
): Promise<GeoTiffTestServer> {
  const payload = readFileSync(fixturePath);

  const server = createServer((req, res) => {
    writeCorsHeaders(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (getPathname(req) !== route) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD, OPTIONS' });
      res.end();
      return;
    }

    const baseHeaders = {
      'Accept-Ranges': 'bytes',
      'Content-Type': 'image/tiff',
    };

    const rangeHeader = req.headers.range;
    if (!rangeHeader) {
      res.writeHead(200, {
        ...baseHeaders,
        'Content-Length': String(payload.length),
      });
      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      res.end(payload);
      return;
    }

    const range = parseRangeHeader(rangeHeader, payload.length);
    if (!range) {
      res.writeHead(416, {
        ...baseHeaders,
        'Content-Range': `bytes */${payload.length}`,
      });
      res.end();
      return;
    }

    const chunk = payload.subarray(range.start, range.end + 1);
    res.writeHead(206, {
      ...baseHeaders,
      'Content-Length': String(chunk.length),
      'Content-Range': `bytes ${range.start}-${range.end}/${payload.length}`,
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    res.end(chunk);
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const address = server.address() as AddressInfo;
  const url = `http://127.0.0.1:${address.port}${route}`;

  return {
    url,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close(err => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      }),
  };
}
