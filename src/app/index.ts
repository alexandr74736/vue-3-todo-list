import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './router/router';

import 'element-plus/dist/index.css';
import '@styles/main.scss';

import App from '@/app/App.vue';

import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
import ru from 'element-plus/es/locale/lang/ru';

const pinia = createPinia();
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app
  .use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: ru
  })
  .mount('#app');
