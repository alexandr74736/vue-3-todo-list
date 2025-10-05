<script setup lang="ts"></script>

<template>
  <main class="wrapper">
    <slot />
  </main>
</template>

<style scoped lang="scss">
@use '@/app/styles/mixins.scss' as *;

.wrapper {
  margin-left: 0;
  padding: adaptiveValueFunc(35, 15, 3840, 320);
  height: 100%;
}
</style>
