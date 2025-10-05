<script setup lang="ts">
import { Header } from '@/widgets';
</script>

<template>
  <div class="main-layout">
    <Header />
    <slot />
  </div>
</template>

<style lang="scss">
#app .main-layout {
  display: grid;
  grid-template-areas:
    'header header header'
    'left-menu main main'
    'left-menu main main';
  grid-template-rows: adaptiveValueFunc(96, 36, 3840, 320) 1fr 1fr;
  grid-template-columns: 0 1fr 1fr;
  height: 100vh;
  position: relative;

  .header {
    grid-area: header;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2010;
    transform: unset;
  }

  & > .empty,
  & > .wrapper {
    grid-area: main;
  }
}
</style>
