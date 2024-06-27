import { createApp } from 'vue'
import { createVuestic } from "vuestic-ui";
import './style.css'
import "vuestic-ui/css";
import "material-design-icons-iconfont/dist/material-design-icons.min.css";
import App from './App.vue'
import { router } from './router';
import { DB_PROVIDER_KEY, db_Provider } from './db';


createApp(App).use(router).use(createVuestic()).provide(DB_PROVIDER_KEY, db_Provider).mount("#app");