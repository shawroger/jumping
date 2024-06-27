import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "../view/home.vue";
import bad404 from "../view/bad404.vue";
import Settings from "../view/settings.vue";
import Dataview from "../view/dataview.vue";

const routes = [
  { path: '/', component: HomeView },
  { path: '/~dataview', component: Dataview },
  { path: '/~settings', component: Settings },
  { path: '/~404', component: bad404 },
  
]

export const routePaths = routes.map(e => e.path);

export const router = createRouter({
  routes,
  history: createWebHistory(),
  
})