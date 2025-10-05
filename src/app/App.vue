<script setup>
import { RouterView, useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/shared/stores/main';
import { Preloader, ErrorBoundary } from '@/shared/ui';
import { onMounted, shallowRef, watchEffect, markRaw } from 'vue';
import { MainLayout } from './layouts';
import AuthLayout from './layouts/AuthLayout/AuthLayout.vue';

const mainStore = useMainStore();
const route = useRoute();
const router = useRouter();
const { loadApp } = storeToRefs(mainStore);
const computedLayout = shallowRef(null);

onMounted(async () => {
  await router.isReady();
  mainStore.initApp();
});

watchEffect(async () => {
  const layoutToUse = route.meta.layout;

  switch (layoutToUse) {
    case 'main':
      computedLayout.value = markRaw(MainLayout);
      break;
    case 'auth':
      computedLayout.value = markRaw(AuthLayout);
      break;
    default:
      computedLayout.value = markRaw(Preloader);
  }
});
</script>

<template>
  <ErrorBoundary>
    <template v-if="loadApp">
      <component :is="computedLayout">
        <RouterView />
      </component>
    </template>
    <template v-else>
      <Preloader />
    </template>
  </ErrorBoundary>
</template>
