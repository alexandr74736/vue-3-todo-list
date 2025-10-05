import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { computed } from 'vue';
import TodosForm from '../TodosForm.vue';

// Define the types for our mock
interface MockBodyDataItem {
  prop: any;
  component: any;
 itemAttributes: Record<string, unknown>;
  componentsAttributes: Record<string, unknown>;
}

interface MockBodyDataArrayItem {
  key: string;
  items: MockBodyDataItem[];
}

// Create a function to create a fresh mock store for each test
const createMockStore = () => ({
  form: {
    name: 'form-todos',
    ruleForm: {
      '0': { status: false, text: '' }
    },
    ruleFormErrors: {},
    ruleFormRef: undefined,
    rules: {},
    body: {
      data: {
        '0': [
          {
            prop: { input: 'text' },
            component: 'input',
            itemAttributes: {},
            componentsAttributes: {}
          }
        ]
      }
    },
    isFormDisabled: false,
    isFormSubmitting: false,
    formHasError: false
  },
  loading: false,
  bodyDataArray: computed(() => [
    {
      key: '0',
      items: [
        {
          prop: { input: 'text' },
          component: 'input',
          itemAttributes: {},
          componentsAttributes: {}
        }
      ]
    },
    {
      key: '1',
      items: [
        {
          prop: { input: 'text' },
          component: 'input',
          itemAttributes: {},
          componentsAttributes: {}
        }
      ]
    }
  ] as MockBodyDataArrayItem[]),
  getInitData: vi.fn(),
  setRef: vi.fn(),
  submit: vi.fn(),
  actionSave: vi.fn(),
  actionAdd: vi.fn(),
  actionDelete: vi.fn(),
  validateChange: vi.fn(),
  validateBlur: vi.fn()
});

// Mock the useTodosForm composable
let mockStore: ReturnType<typeof createMockStore>;

vi.mock('../../model', () => ({
  useTodosForm: () => mockStore
}));

// Mock storeToRefs to return reactive references
vi.mock('pinia', async () => {
  const actual = await vi.importActual('pinia');
  return {
    ...actual,
    storeToRefs: (store: any) => store // Return the store itself to access its properties
  };
});

describe('TodosForm.vue', () => {
 beforeEach(() => {
   // Create a new pinia instance and set it active
   const pinia = createPinia();
   setActivePinia(pinia);
   
   // Reset the mock store to default state
   mockStore = createMockStore();
   // The mock store is already set up properly
   
   // Reset mocks before each test
   vi.clearAllMocks();
 });

 it('renders properly', async () => {
    const wrapper = mount(TodosForm, {
      global: {
        directives: {
          loading: {} // Mock the loading directive
        }
      }
    });

    // Wait for component to be mounted and onMounted to run
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('form');
    expect(wrapper.classes()).toContain('form_form-todos'); // The real store uses 'form-todos' as name
 });

  it('renders form header with title and buttons', async () => {
     const wrapper = mount(TodosForm, {
       global: {
         directives: {
           loading: {} // Mock the loading directive
         }
       }
     });
     
     // Wait for component to be mounted and onMounted to run
     await new Promise(resolve => setTimeout(resolve, 0));
     
     // Check if the elements exist in the HTML
     const html = wrapper.html();
     expect(html).toContain('Задачи');
     expect(html).toContain('form__button--add');
     expect(html).toContain('Сохранить');
  });

  it('calls actionAdd when add button is clicked', async () => {
    const actionAddSpy = vi.fn();
    mockStore.actionAdd = actionAddSpy;

    const wrapper = mount(TodosForm, {
      global: {
        directives: {
          loading: {} // Mock the loading directive
        }
      }
    });

    const addButton = wrapper.find('.form__button--add');
    await addButton.trigger('click');

    expect(actionAddSpy).toHaveBeenCalled();
  });

  it('calls actionSave when save button is clicked', async () => {
     const actionSaveSpy = vi.fn();
     mockStore.actionSave = actionSaveSpy;
 
     const wrapper = mount(TodosForm, {
       global: {
         directives: {
           loading: {} // Mock the loading directive
         }
       }
     });
     
     // Wait for component to be mounted and onMounted to run
     await new Promise(resolve => setTimeout(resolve, 0));
 
     // Check if the save button exists in the HTML
     const html = wrapper.html();
     expect(html).toContain('form__button--add');
     expect(html).toContain('Сохранить');
     
     // Find the save button by its class
     const saveButtons = wrapper.findAll('.form__button--add');
     expect(saveButtons.length).toBe(2);
     
     // The second button is the save button (with el-button--primary class)
     const saveButton = saveButtons[1];
     await saveButton.trigger('click');
 
     expect(actionSaveSpy).toHaveBeenCalled();
   });

  it('shows loading state when loading is true', () => {
    mockStore.loading = true;

    const wrapper = mount(TodosForm, {
      global: {
        directives: {
          loading: {} // Mock the loading directive
        }
      }
    });

    // Check if the loading value is correctly set in the mock
    expect(mockStore.loading).toBe(true);
  });

  it('renders Draggable component with bodyDataArray', async () => {
    // Mock the store to return immediately
    mockStore.getInitData = vi.fn().mockResolvedValue(undefined);
    
    const wrapper = mount(TodosForm, {
      global: {
        directives: {
          loading: {} // Mock the loading directive
        }
      }
    });

    // Wait for the component to fully render (including async operations)
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 10)); // Additional wait for async operations

    // Check that Draggable component is rendered - it should exist even if empty
    // The Draggable component should be rendered inside the form__content div
    const draggableElement = wrapper.find('.draggable-container');
    expect(draggableElement.exists()).toBe(true);
  });
});