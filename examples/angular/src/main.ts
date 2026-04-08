import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// v-map is loaded via a <script type="module"> tag in index.html
// (from jsDelivr) instead of being bundled through esbuild. We just
// wait for the v-map custom element to be defined before bootstrapping
// the Angular app, so the showcase can rely on the elements being
// upgraded immediately.
async function bootstrap() {
  await customElements.whenDefined('v-map');
  await bootstrapApplication(AppComponent, appConfig);
}

bootstrap().catch(err => {
  console.error(err);
});
