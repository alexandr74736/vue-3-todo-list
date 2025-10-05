<script setup lang="ts">
import { ElFormItem } from 'element-plus';
import { computed } from 'vue';

const props = defineProps<{
  name?: string;
  error?: string;
}>();

const classModifier = computed(() => {
  if (typeof props.name === 'string') {
    return `form__item--${props.name}`;
  }
});

const errorComputed = computed(() => {
  return props.error;
});
</script>

<template>
  <ElFormItem class="form__item" :class="classModifier" :error="errorComputed">
    <slot />
  </ElFormItem>
</template>

<style lang="scss" scoped>
.form__item {
  font-size: 14px;
  line-height: 18px;
  color: var(--sb-gray-1);
  display: flex;
  flex-direction: column;

  :deep(.el-form-item__label) {
    color: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  :deep(.el-input__inner) {
    color: var(--text-dark-blue-1);
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
