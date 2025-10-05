<script setup>
import { ref } from 'vue';

const props = defineProps({
  animate: {
    type: Boolean,
    default: true
  },
  teleport: {
    type: String,
    default: 'body'
  },
  load: {
    type: Boolean,
    default: true
 },
  color: {
    type: String,
    default: '#7367F0',
    validator: (value) => {
      if (value.startsWith('#')) {
        return value;
      } else {
        throw new Error('Только HEX формат');
      }
    }
  }
});

const isVisible = ref(props.visible);
</script>

<template>
  <teleport :to="props.teleport">
    <div 
      v-loading="load" 
      :class="{ 'is-fullscreen': true }"
      :style="{ 
        '--el-loading-spinner-color': color,
        '--el-loading-spinner-size': '48px'
      }"
      class="sb-preloader"
    >
    </div>
  </teleport>
</template>

<style scoped lang="scss">
.sb-preloader {
  &.is-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
  }
}
</style>
