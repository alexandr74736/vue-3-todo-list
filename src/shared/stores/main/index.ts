import { defineStore } from 'pinia';
import { computed, ref, ComputedRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// Removed user store import as authentication is not needed

export const useMainStore = defineStore('mainData', () => {
  const loadApp = ref(false);
  const route = useRoute();
  const router = useRouter();
  
  // Default layout for the application
  const layout: ComputedRef<string> = computed(() => 'main');

  const initApp = async (): Promise<void> => {
    try {
      // Initialize app logic here
    } finally {
      loadApp.value = true;
    }
  };

  return {
    loadApp,
    layout,
    initApp
  };
});