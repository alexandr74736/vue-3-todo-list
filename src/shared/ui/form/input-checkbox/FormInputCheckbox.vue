<script setup lang="ts">
import { ElCheckbox } from 'element-plus';
import { computed, useAttrs } from 'vue';
import { FormInput } from '@/shared/ui/form';

defineOptions({
  inheritAttrs: false
});

const props = defineProps<{
  modelValue: {
    status: boolean;
    text: string;
 };
  name?: string;
}>();

const $attrs = useAttrs();

const classModifier = computed(() => {
  if (typeof props.name === 'string') {
    return `form__input--${props.name}`;
  }
});

const emit = defineEmits<{
  (
    e: 'update:modelValue',
    value: { status: boolean | string; text: string }
  ): void;
  (e: 'blur'): void;
}>();

const childDataCheckbox = computed({
  get: () => props.modelValue.status,
  set: (value) =>
    emit('update:modelValue', { ...props.modelValue, status: value })
});
const childDataInput = computed({
  get: () => props.modelValue.text,
  set: (value) =>
    emit('update:modelValue', { ...props.modelValue, text: value })
});

// Filter out attributes that shouldn't be passed to the ElCheckbox component
const filteredAttrs = computed(() => {
  const attrs = { ...$attrs };
  // Remove attributes that would cause validation errors
 delete attrs.label;
  return attrs;
});
</script>

<template>
 <div class="form__checkbox-wrapper">
   <ElCheckbox
     class="form__checkbox"
     :class="classModifier"
     v-model="childDataCheckbox"
     size="large"
     v-bind="filteredAttrs"
     :aria-label="name ? `${name} checkbox` : 'Checkbox'"
   />
   <FormInput
     v-model="childDataInput"
     @blur="$emit('blur')"
     :name="name ? `${name}-input` : undefined"
     :aria-label="name ? `${name} input` : 'Input field'"
   />
 </div>
</template>

<style lang="scss" scoped>
@use '@/app/styles/mixins.scss' as *;

.form__checkbox-wrapper {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: adaptiveValueFunc(12, 8, 3840, 320);
}

.form__checkbox {
  height: auto;

  :deep(.el-checkbox__label) {
    padding: 0;
  }
  :deep(.el-checkbox__inner) {
    height: adaptiveValueFunc(80, 30, 3840, 320);
    width: adaptiveValueFunc(80, 30, 3840, 320);
  }
  :deep(::after) {
    border: adaptiveValueFunc(7, 2, 3840, 320) solid transparent;
    border-left: 0;
    border-top: 0;
    height: adaptiveValueFunc(40, 14, 3840, 320);
    left: adaptiveValueFunc(27, 10, 3840, 320);
    top: adaptiveValueFunc(8, 2, 3840, 320);
    width: adaptiveValueFunc(14, 5, 3840, 320);
  }
}

:deep(.el-input__inner) {
  font-size: adaptiveValueFunc(32, 14, 3840, 320);
  height: adaptiveValueFunc(80, 32, 3840, 320);
  line-height: adaptiveValueFunc(80, 32, 3840, 320);
}

:deep(.el-input__wrapper) {
  height: adaptiveValueFunc(80, 32, 3840, 320);
}
</style>
