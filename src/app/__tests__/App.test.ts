import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { nextTick } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import App from '../App.vue';
import MainLayout from '../layouts/MainLayout/MainLayout.vue';
import Preloader from '@/shared/ui/preloader/Preloader.vue';
import Home from '@/pages/home/Home.vue';

describe('App.vue', () => {
  let router: any;
  let pinia: any;

  beforeEach(() => {
    // Create a new pinia instance
    pinia = createPinia();
    setActivePinia(pinia);

    // Create a mock router
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'home',
          component: Home,
          meta: { layout: 'main' }
        },
        {
          path: '/no-layout',
          name: 'no-layout',
          component: Home
        }
      ]
    });
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

 it('renders properly', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router]
      }
    });

    // Wait for router to be ready
    await router.isReady();
    
    // Update the store to simulate app loading
    const { useMainStore } = await import('@/shared/stores/main');
    const mainStore = useMainStore();
    mainStore.loadApp = true;

    // Wait for DOM update
    await nextTick();

    expect(wrapper.exists()).toBe(true);
  });

  it('shows preloader when app is not loaded', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router]
      }
    });

    // Wait for router to be ready
    await router.isReady();
    
    // Update the store to simulate app not loaded
    const { useMainStore } = await import('@/shared/stores/main');
    const mainStore = useMainStore();
    mainStore.loadApp = false;

    // Wait for DOM update
    await nextTick();

    // Check that preloader is shown when loadApp is false
    expect(wrapper.findComponent(Preloader).exists()).toBe(true);
  });

  it('renders MainLayout when route has main layout meta', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
        directives: {
          loading: {} // Mock the loading directive
        }
      }
    });

    // Navigate to a route with main layout
    await router.push('/');
    await router.isReady();
    
    // Update the store to simulate app loading
    const { useMainStore } = await import('@/shared/stores/main');
    const mainStore = useMainStore();
    mainStore.loadApp = true;

    // Wait for DOM update
    await nextTick();

    // Check that MainLayout is rendered
    expect(wrapper.findComponent(MainLayout).exists()).toBe(true);
  });
});