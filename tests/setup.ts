import { vi } from 'vitest';

// Типизированные глобальные моки для тестов
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}

global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Мок для Element.prototype.scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Мок для CSSStyleSheet
global.CSSStyleSheet = class MockCSSStyleSheet {
  cssRules: string[];

  constructor() {
    this.cssRules = [];
  }

  insertRule(rule: string, index?: number): number {
    const insertIndex = index ?? this.cssRules.length;
    
    if (insertIndex >= 0 && insertIndex <= this.cssRules.length) {
      this.cssRules.splice(insertIndex, 0, rule);
      return insertIndex;
    }
    
    throw new Error('INDEX_SIZE_ERR');
  }
  
  // Добавляем необходимые свойства для совместимости
  get ownerRule() { return null; }
  get rules() { return this.cssRules; }
  addRule(selector?: string, style?: string, index?: number) {
    if (selector && style) {
      const rule = `${selector} { ${style} }`;
      return this.insertRule(rule, index);
    }
    return -1;
  }
  deleteRule(index: number) {
    if (index >= 0 && index < this.cssRules.length) {
      this.cssRules.splice(index, 1);
    }
  }
  
  // Добавляем остальные необходимые методы и свойства
  removeRule(index: number) {
    this.deleteRule(index);
  }
  
  get disabled() { return false; }
  get href() { return null; }
  get media() { return { length: 0, item: () => null, contains: () => false }; }
  get parentStyleSheet() { return null; }
  get title() { return null; }
  get type() { return 'text/css'; }
  
  // Заглушка для replace
  replace() { return Promise.resolve(this as any); }
  replaceSync() { return this as any; }
  
  get cssText() { return this.cssRules.join('\n'); }
} as any;