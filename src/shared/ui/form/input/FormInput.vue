<script setup lang="ts">
import { ElInput } from 'element-plus';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  name?: string;
  maxSpaces?: number;
}>();

const classModifier = computed(() => {
  if (typeof props.name === 'string') {
    return `form__input--${props.name}`;
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const childData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', checkWhiteSpaces(value))
});

function checkWhiteSpaces(value: string) {
  if (props.maxSpaces === 0) {
    return value.replace(/ /g, '');
  } else {
    const spaces =
      props.maxSpaces !== undefined ? ' '.repeat(props.maxSpaces + 1) : '  ';
    return value.replace(new RegExp(spaces, 'g'), ' ');
  }
}
</script>

<template>
  <ElInput
    class="form__input"
    :class="classModifier"
    v-model="childData"
    size="large"
    :aria-label="name || 'Input field'"
  />
</template>

<style lang="scss" scoped>
@use '@/app/styles/mixins.scss' as *;

.form__input {
  :deep(.el-input__wrapper) {
    padding: adaptiveValueFunc(1, 0.5, 3840, 320)
      adaptiveValueFunc(12, 8, 3840, 320);
    height: adaptiveValueFunc(80, 30, 3840, 320);
    min-height: adaptiveValueFunc(80, 30, 3840, 320);
  }

  :deep(.el-input__inner) {
    font-size: adaptiveValueFunc(32, 10, 3840, 320);
    line-height: adaptiveValueFunc(32, 16, 3840, 320);
    color: var(--text-dark-blue-1);
    padding: adaptiveValueFunc(8, 6, 3840, 320) 0;
    height: adaptiveValueFunc(80, 30, 3840, 320);
    min-height: adaptiveValueFunc(80, 30, 3840, 320);
  }

  :deep(.el-input) {
    height: adaptiveValueFunc(80, 30, 3840, 320);
    min-height: adaptiveValueFunc(80, 30, 3840, 320);
  }
}
</style>
