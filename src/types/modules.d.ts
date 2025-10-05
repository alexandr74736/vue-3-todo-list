declare module '@/shared/stores/main' {
  export const useMainStore: () => {
    loadApp: boolean;
    layout: import('vue').ComputedRef<string>;
    initApp: () => Promise<void>;
  };
}