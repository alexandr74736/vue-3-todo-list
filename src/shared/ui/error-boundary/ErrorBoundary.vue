<template>
  <div v-if="hasError" class="error-boundary">
    <h2>Что-то пошло не так</h2>
    <p>Произошла ошибка в компоненте. Пожалуйста, обновите страницу или свяжитесь с поддержкой.</p>
    <button @click="handleReset">Попробовать снова</button>
 </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

const hasError = ref(false);

const handleReset = () => {
  hasError.value = false;
};

onErrorCaptured((err) => {
  console.error('Error captured by boundary:', err);
  hasError.value = true;
  return false; // Prevents the error from propagating further
});
</script>

<style scoped>
.error-boundary {
  padding: 20px;
  text-align: center;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin: 10px;
}

.error-boundary button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>