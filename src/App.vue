<script setup lang="ts">
import navBar from './components/navbar.vue'
import footerApp from './components/footer.vue'
import jumping from './components/jumping.vue'

import { watch, ref, computed } from "vue"
import { loadDB } from './utils/loadDB';
import { useWindow } from './utils/useWindow';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { catchParam } from './utils/checkURL';
import { routePaths } from './router';


const { width } = useWindow();

const route = useRoute();

const db = loadDB();
db.current().init();

const page = ref(1);
const showSidebar = ref(false);



function clickNavBar(value: boolean) {
  showSidebar.value = value;
}

const isJumping = ref(false);
const routeFullPath = computed(() => route.fullPath.slice(1));

watch(routeFullPath, () => {
  page.value = routePaths.findIndex(e => e === route.path);
  isJumping.value = !routePaths.includes(route.fullPath);
})



</script>

<template>
  <VaLayout>
    <template #top>
      <navBar @click-navbar="clickNavBar"></navBar>
    </template>

    <template #left>
      <VaSidebar activeColor="#04030C" v-model="showSidebar" :style="{ 'width': showSidebar ? (width < 700 ? '100vw' : '100%') : '0px' }">
        <VaSidebarItem :active="page === 0" @click="page = 0" to="/">
          <VaSidebarItemContent>
            <VaIcon name="home" />
            <VaSidebarItemTitle>
              Home
            </VaSidebarItemTitle>
          </VaSidebarItemContent>
        </VaSidebarItem>
        <VaSidebarItem :active="page === 1" @click="page = 1" to="/~dataview">
          <VaSidebarItemContent>
            <VaIcon name="bubble_chart" />
            <VaSidebarItemTitle>
              Data viewer
            </VaSidebarItemTitle>
          </VaSidebarItemContent>
        </VaSidebarItem>
        <VaSidebarItem :active="page === 2" @click="page = 2" to="/~settings">
          <VaSidebarItemContent>
            <VaIcon name="settings" />
            <VaSidebarItemTitle>
              Settings
            </VaSidebarItemTitle>
          </VaSidebarItemContent>
        </VaSidebarItem>
      </VaSidebar>
    </template>

    <template #content>
      <div class="content-container">
        <router-view v-if="!isJumping"></router-view>
        <jumping :to="routeFullPath" v-else></jumping>
      </div>

      <footerApp></footerApp>
    </template>
  </VaLayout>
</template>

<style lang="less" scoped>
.va-layout {
  min-height: 100vh;
}

.content-container {
  min-height: 75vh;

  // @media screen and (max-height: 768px) {
  //   & {

  //     min-height: 90vh;
  //   }
  // }
}
</style>
