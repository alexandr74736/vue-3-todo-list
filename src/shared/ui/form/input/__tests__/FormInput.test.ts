import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import FormInput from '../FormInput.vue';

describe('FormInput.vue', () => {
 it('renders properly with modelValue', () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: 'test value',
        name: 'test'
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('form__input');
    expect(wrapper.classes()).toContain('form__input--test');
  });

  it('emits update:modelValue when input changes', async () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: 'initial value',
        name: 'test'
      }
    });

    const input = wrapper.find('input');
    await input.setValue('new value');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value']);
  });

  it('removes all spaces when maxSpaces is 0', async () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: 'test value',
        maxSpaces: 0
      }
    });

    const input = wrapper.find('input');
    await input.setValue('test value with spaces');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    // Should remove all spaces
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('testvaluewithspaces');
  });

 it('limits spaces when maxSpaces is specified', async () => {
   const wrapper = mount(FormInput, {
     props: {
       modelValue: 'test value',
       maxSpaces: 1
     }
   });

   const input = wrapper.find('input');
   await input.setValue('test  value  with  spaces'); // double spaces

   expect(wrapper.emitted('update:modelValue')).toBeTruthy();
   // When maxSpaces is 1, it replaces 2 consecutive spaces ('  ') with a single space
   expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('test value with spaces');
 });

  it('handles multiple spaces correctly with different maxSpaces values', async () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: 'test value',
        maxSpaces: 2
      }
    });

    const input = wrapper.find('input');
    await input.setValue('test   value    with     spaces'); // 3, 4, and 5 spaces

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    // When maxSpaces is 2, it replaces exactly 3 consecutive spaces ('   ') with a single space
    // The regex looks for ' '.repeat(maxSpaces + 1) which is 3 spaces when maxSpaces is 2
    // So 'test   value' (3 spaces) → 'test value' (1 space) - first 3 become 1
    // '    with' (4 spaces) → '  with' (2 spaces) - first 3 become 1, leaving 1, so 4-3+1=2
    // '     spaces' (5 spaces) → '   spaces' (3 spaces) - first 3 become 1, leaving 2, so 5-3+1=3
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('test value  with   spaces');
  });

  it('works without name prop', () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: 'test value'
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('form__input');
    // Should not have the modifier class since name is not provided
    expect(wrapper.classes()).not.toContain('form__input--undefined');
  });

  it('works without maxSpaces prop', async () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: 'test value'
      }
    });

    const input = wrapper.find('input');
    await input.setValue('test  value  with  spaces'); // double spaces

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    // Without maxSpaces, it defaults to replacing double spaces ('  ') with single space
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('test value with spaces');
  });
});