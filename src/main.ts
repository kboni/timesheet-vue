import { createApp, useCssModule } from "vue";
import { Vue } from 'vue-class-component';
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import api from './utils/api';

createApp(App)
  .use(store)
  .use(router)
  .mount("#app");