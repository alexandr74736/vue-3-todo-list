<template>
  <div class="draggable-container">
    <VueDraggableNext
      :list="modelValue"
      @change="handleChange"
      v-bind="allOptions"
    >
      <div
        v-for="(element, index) in modelValue"
        :key="element.key"
        class="draggable-item"
        :data-key="element.key"
      >
        <slot :element="element" :index="index" name="item" />
      </div>
    </VueDraggableNext>
  </div>
</template>

<script setup lang="ts">
import { VueDraggableNext } from 'vue-draggable-next';
import { computed } from 'vue';

interface DraggableItem {
  key: string | number;
  [key: string]: unknown;
}

interface Props<T = DraggableItem> {
  modelValue: T[];
  options?: Record<string, unknown>;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({})
});

const emit = defineEmits(['update:modelValue']);

interface DraggableEvent {
  moved?: { element: unknown; newIndex: number; oldIndex: number };
  added?: { element: unknown; newIndex: number };
  removed?: { element: unknown; oldIndex: number };
}

const handleChange = (event: DraggableEvent) => {
  // Обновляем значение при изменении порядка элементов
  if (event.moved || event.added || event.removed) {
    emit('update:modelValue', props.modelValue);
  }
};

// Combine all options ensuring itemKey has a default while not explicitly passing the others as separate props
const allOptions = computed(() => {
  const options = { ...props.options };
  // Ensure itemKey has a default value
  if (!options.itemKey) {
    options.itemKey = 'key';
  }
  return options;
});
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<style scoped>
.draggable-container {
  width: 100%;
}
.draggable-item {
  display: block;
}
</style>
