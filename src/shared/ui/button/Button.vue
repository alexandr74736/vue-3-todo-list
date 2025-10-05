<script setup lang="ts">
import { ElButton } from 'element-plus';
import { computed } from 'vue';

interface Emit {
  (e: 'update:click'): void;
}

const emit = defineEmits<Emit>();
const props = defineProps<{
  name?: string;
  disabled?: boolean;
}>();

const classModifier = computed(() => {
  if (typeof props.name === 'string') {
    return `button--${props.name}`;
  }
});
</script>

<template>
  <ElButton
    class="button"
    :class="classModifier"
    :disabled="props.disabled"
    @click="(): void => emit('update:click')"
  >
    <slot />
  </ElButton>
</template>

<style lang="scss" scoped>
@use '@/app/styles/mixins.scss' as *;

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: adaptiveValueFunc(6, 4, 3840, 320);
  font-size: adaptiveValueFunc(32, 14, 3840, 320);
  font-weight: 600;
  text-align: center;
  height: adaptiveValueFunc(80, 30, 3840, 320);
  min-height: adaptiveValueFunc(80, 30, 3840, 320);
  width: auto;
  padding: adaptiveValueFunc(10, 8, 3840, 320)
    adaptiveValueFunc(28, 20, 3840, 320);
  border-radius: adaptiveValueFunc(5, 3, 3840, 320);
  transition-duration: 0.5s;

  :deep(.el-button__inner) {
    height: adaptiveValueFunc(80, 30, 3840, 320);
    line-height: adaptiveValueFunc(80, 30, 3840, 320);
  }

  :deep(.el-button) {
    height: adaptiveValueFunc(80, 30, 3840, 320);
    min-height: adaptiveValueFunc(80, 30, 3840, 320);
  }

  & + .button {
    margin-left: 0;
  }

  // Gray
  &.gray {
    color: rgb(185, 185, 195);
    border-width: adaptiveValueFunc(1.5, 1, 3840, 320);
    border-style: solid;
    border-color: rgb(185, 185, 195);
    background-color: #fff;

    &:hover {
      background-color: transparent;
      color: rgb(119, 121, 125);
      border-color: rgb(119, 121, 125);
    }
  }

  // Submit
  &.submit {
    color: rgb(255, 255, 255);
    background-color: rgb(115, 103, 240);
    box-shadow: transparent 0px 0px 0px 0px;

    &:hover {
      box-shadow: rgb(115, 103, 240) 0px 0px adaptiveValueFunc(10, 5, 3840, 320)
        0px;
    }

    &:disabled {
      color: rgb(255, 255, 255);
      background-color: #cac6fa;

      &:hover {
        box-shadow: none;
      }
    }
  }
  // Main-empty
  &.main-empty {
    color: rgb(115, 103, 240);
    box-shadow: transparent 0px 0px 0px 0px;
    background-color: transparent;
    border-color: rgb(115, 103, 240);

    &:hover {
      box-shadow: none;
      color: rgb(255, 255, 255);
      background-color: rgb(115, 103, 240);
    }

    &:disabled {
      color: rgb(255, 255, 255);
      background-color: #cac6fa;

      &:hover {
        box-shadow: none;
      }
    }
  }

  // Ban
  &.ban {
    color: #ffffff;
    background-color: #fb5f55;
    box-shadow: none;
    max-width: adaptiveValueFunc(294, 200, 3840, 320);
    width: 100%;

    &:hover {
      box-shadow: none;
    }
  }

  // Unban
  &.unban {
    color: #ffffff;
    background-color: #28c483;
    box-shadow: none;
    max-width: adaptiveValueFunc(294, 200, 3840, 320);
    width: 100%;

    &:hover {
      box-shadow: none;
    }
  }

  // Plus-field
  &.plus-field {
    box-shadow: none;
    width: auto;
    height: auto;
    color: rgb(185, 185, 195);
    border-width: adaptiveValueFunc(1.5, 1, 3840, 320);
    border-style: solid;
    border-color: rgb(185, 185, 195);
    background-color: #fff;

    :deep(> span) {
      display: flex;
      flex-direction: row;
      gap: adaptiveValueFunc(6, 4, 3840, 320);
    }

    &:hover {
      box-shadow: none;
      background-color: transparent;
      color: rgb(119, 121, 125);
      border-color: rgb(119, 121, 125);
    }
  }
}
</style>
