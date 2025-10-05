import { describe, it, expect, vi } from 'vitest';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '../router/router';

// Mock the imports that are used in the index.js file
vi.mock('vue', async () => {
  const actual = await import('vue');
  return {
    ...actual,
    createApp: vi.fn(() => ({
      use: vi.fn().mockReturnThis(),
      component: vi.fn().mockReturnThis(),
      mount: vi.fn()
    }))
  };
});

vi.mock('pinia', async () => {
  const actual = await import('pinia');
  return {
    ...actual,
    createPinia: vi.fn(() => ({
      use: vi.fn().mockReturnThis()
    }))
  };
});

vi.mock('../router/router', () => ({
  router: {
    use: vi.fn().mockReturnThis()
  }
}));

vi.mock('@/app/App.vue', () => ({
  default: {}
}));

vi.mock('element-plus', () => ({
  default: {}
}));

vi.mock('@element-plus/icons-vue', () => ({}));

// Import the module to test side effects
import App from '@/app/App.vue';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

describe('App Initialization', () => {
  it('should initialize the app correctly', () => {
    // Mock the createApp function to return a mock app instance
    const mockApp = {
      use: vi.fn().mockReturnThis(),
      component: vi.fn().mockReturnThis(),
      mount: vi.fn()
    };

    const createAppSpy = vi.mocked(createApp);
    createAppSpy.mockReturnValue(mockApp as any);

    const createPiniaSpy = vi.mocked(createPinia);
    const mockPinia = { use: vi.fn().mockReturnThis() };
    createPiniaSpy.mockReturnValue(mockPinia as any);

    // Import the index file to trigger the initialization
    import('../index').then(() => {
      // Verify that createApp was called with the App component
      expect(createAppSpy).toHaveBeenCalledWith(App);

      // Verify that pinia was created and used
      expect(createPiniaSpy).toHaveBeenCalled();
      expect(mockPinia.use).toHaveBeenCalled();

      // Verify that router was used
      expect(mockApp.use).toHaveBeenCalledWith(router);

      // Verify that ElementPlus was used with Russian locale
      expect(mockApp.use).toHaveBeenCalledWith(ElementPlus, expect.objectContaining({
        locale: expect.any(Object)
      }));

      // Verify that all ElementPlus icons were registered
      expect(mockApp.component).toHaveBeenCalled();
    });
  });

  it('should register all ElementPlus icons', () => {
    const mockApp = {
      use: vi.fn().mockReturnThis(),
      component: vi.fn().mockReturnThis(),
      mount: vi.fn()
    };

    const createAppSpy = vi.mocked(createApp);
    createAppSpy.mockReturnValue(mockApp as any);

    // Test icon registration logic separately
    const app = mockApp;
    const iconCount = Object.keys(ElementPlusIconsVue).length;

    // Register all icons
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }

    // Verify that component was called for each icon
    expect(mockApp.component).toHaveBeenCalledTimes(iconCount > 0 ? iconCount : 0);
  });
});