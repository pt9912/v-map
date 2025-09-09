import { defineUserConfig } from 'vitepress-export-pdf';

export default defineUserConfig({
  outDir: 'docs',
  outFile: 'site.pdf',
  puppeteerLaunchOptions: {
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});
