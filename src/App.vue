<script setup lang="ts">
import navBar from "./components/navbar.vue";
import footerApp from "./components/footer.vue";
import jumping from "./components/jumping.vue";
import { VNodeRef } from "vue";
import { watch, ref, computed } from "vue";
import { loadDB } from "./utils/loadDB";
import { useWindow } from "./utils/useWindow";
import { useRoute} from "vue-router";
import { routePaths } from "./router";

const { width } = useWindow();

const route = useRoute();

const db = loadDB();
db.current().init();

const page = ref(0);
const navRef = ref(null as VNodeRef | null);
const showSidebar = ref(false);

function clickNavBar(value: boolean) {
  showSidebar.value = value;
}

const isJumping = ref(false);
const routeFullPath = computed(() => route.fullPath.slice(1));

function matchRoute() {
  page.value = routePaths.findIndex((e) => e === route.path);
  isJumping.value = !routePaths.includes(route.fullPath);
}

watch(routeFullPath, () => {
  matchRoute();
});

matchRoute();

function clickMenu(pageValue: number) {
  page.value = pageValue;
  showSidebar.value = false; console.log(navRef.value);
  if(navRef.value) {
    navRef.value.showSidebar = false;
  }
}
</script>

<template>
  <VaLayout>
    <template #top>
      <navBar @click-navbar="clickNavBar" ref="navRef"></navBar>
    </template>

    <template #left>
      <VaSidebar
        activeColor="#04030C"
        v-model="showSidebar"
        :style="{
          width: showSidebar ? (width < 700 ? '100vw' : '100%') : '0px',
        }"
      >
        <VaSidebarItem :active="page === 0" @click="clickMenu(0)" to="/">
          <VaSidebarItemContent>
            <VaIcon name="home" />
            <VaSidebarItemTitle> Home </VaSidebarItemTitle>
          </VaSidebarItemContent>
        </VaSidebarItem>
        <VaSidebarItem
          :active="page === 1"
          @click="clickMenu(1)"
          to="/~dataview"
        >
          <VaSidebarItemContent>
            <VaIcon name="bubble_chart" />
            <VaSidebarItemTitle> Data viewer </VaSidebarItemTitle>
          </VaSidebarItemContent>
        </VaSidebarItem>
        <VaSidebarItem
          :active="page === 2"
          @click="clickMenu(2)"
          to="/~settings"
        >
          <VaSidebarItemContent>
            <VaIcon name="settings" />
            <VaSidebarItemTitle> Settings </VaSidebarItemTitle>
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
  min-height: 72vh;

  @media screen and(max-width: 1200px) {
    min-height: 75vh;
  }

  @media screen and(max-width: 768px) {
    min-height: 70vh;
  }
}
</style>
