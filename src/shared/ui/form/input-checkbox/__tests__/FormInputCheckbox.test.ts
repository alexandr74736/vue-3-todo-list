import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FormInputCheckbox from '../FormInputCheckbox.vue';
import FormInput from '../../input/FormInput.vue';

describe('FormInputCheckbox.vue', () => {
  it('renders properly with modelValue', () => {
    const wrapper = mount(FormInputCheckbox, {
      props: {
        modelValue: {
          status: false,
          text: 'test text'
        },
        name: 'test'
      }
    });

    expect(wrapper.exists()).toBe(true);
    // The ElCheckbox component is the root element, so check its classes
    const checkboxElement = wrapper.find('label'); // ElCheckbox renders as a label element
    expect(checkboxElement.classes()).toContain('form__checkbox');
    expect(checkboxElement.classes()).toContain('form__input--test');
  });

  it('renders nested FormInput component', () => {
    const wrapper = mount(FormInputCheckbox, {
      props: {
        modelValue: {
          status: false,
          text: 'test text'
        }
      }
    });

    // Check that FormInput component is rendered inside
    expect(wrapper.findComponent(FormInput).exists()).toBe(true);
  });

  it('emits update:modelValue when checkbox status changes', async () => {
    const wrapper = mount(FormInputCheckbox, {
      props: {
        modelValue: {
          status: false,
          text: 'test text'
        }
      }
    });

    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setValue(true);

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ status: true, text: 'test text' }]);
  });

  it('emits update:modelValue when input text changes', async () => {
    const wrapper = mount(FormInputCheckbox, {
      props: {
        modelValue: {
          status: false,
          text: 'test text'
        }
      }
    });

    // Find the nested FormInput and change its value
    const formInput = wrapper.findComponent(FormInput);
    await formInput.vm.$emit('update:modelValue', 'new text');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ status: false, text: 'new text' }]);
  });

 it('emits blur event when input is blurred', async () => {
    const wrapper = mount(FormInputCheckbox, {
      props: {
        modelValue: {
          status: false,
          text: 'test text'
        }
      }
    });

    // Trigger blur on the nested input
    const formInput = wrapper.findComponent(FormInput);
    await formInput.vm.$emit('blur');

    expect(wrapper.emitted('blur')).toBeTruthy();
  });

 it('works without name prop', () => {
    const wrapper = mount(FormInputCheckbox, {
      props: {
        modelValue: {
          status: false,
          text: 'test text'
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('form__checkbox-wrapper');
    // Should not have the modifier class since name is not provided
    expect(wrapper.classes()).not.toContain('form__checkbox--undefined');
  });

  it('correctly updates both status and text independently', async () => {
    const wrapper = mount(FormInputCheckbox, {
      props: {
        modelValue: {
          status: false,
          text: 'original text'
        }
      }
    });

    // Change the checkbox status
    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setValue(true);

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ status: true, text: 'original text' }]);

    // Change the input text
    const formInput = wrapper.findComponent(FormInput);
    await formInput.vm.$emit('update:modelValue', 'updated text');

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([{ status: false, text: 'updated text' }]);
  });
});