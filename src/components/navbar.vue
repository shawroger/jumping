<script setup lang="ts">
import logo from "../assets/rogerlogo2.png"
import { ref, defineEmits } from "vue"
const showSidebar = ref(false);
const clickNavBarEmit = defineEmits(["click-navbar"]);

function clickNavBar() {
  showSidebar.value = !showSidebar.value;
  clickNavBarEmit("click-navbar", showSidebar.value);
}
</script>

<template>
  <VaNavbar color="#04030C" class="mb-3">
    <template #left>
      <VaButton color="#04030C" :icon="showSidebar ? 'menu_open' : 'menu'" @click="clickNavBar" />
      <VaNavbarItem>
        <p style="margin-left: 1em;width: 200px;">AUTO JUMPING TOOLS</p>
      </VaNavbarItem>
    </template>
    <template #right>
      <VaNavbarItem class="logo hidden sm:block">
        <img :src="logo" alt="web-logo" />
      </VaNavbarItem>
    </template>
  </VaNavbar>
</template>

<style lang="less" scoped>
.logo {
  img {
    width: 50px;
    max-width: 100%;
    max-height: 100%;
  }

}
</style>
