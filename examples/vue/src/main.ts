import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

// v-map is loaded via a <script type="module"> tag in index.html
// (from jsDelivr) instead of being bundled through Vite. We just wait
// for the v-map custom element to be defined before mounting Vue,
// so the demo can rely on the elements being upgraded immediately.
async function bootstrap() {
  await customElements.whenDefined('v-map');
  createApp(App).mount('#app');
}

bootstrap();
