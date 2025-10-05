<script setup lang="ts">
// Removed authentication functionality
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="header__left" @click="$router.push('/')">
        <div class="header__logo">Логотип</div>
      </div>
      <div class="header__right">
        <div class="header__profile">
          Демо пользователь
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/app/styles/mixins.scss' as *;

.header {
  width: 100%;
  height: auto;
  padding: adaptiveValueFunc(32, 10, 3840, 320)
    adaptiveValueFunc(30, 15, 3840, 320);

  .container {
    width: auto;
    max-width: unset;
    margin: 0;
    height: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0;
  }

  &__left {
    display: grid;
    align-items: center;
  }

  &__logo {
    height: auto;
    width: auto;
    font-size: adaptiveValueFunc(32, 16, 3840, 320);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: adaptiveValueFunc(32, 16, 3840, 320);
  }

  &__left {
    cursor: pointer;
  }

  &__right {
    cursor: pointer;
  }

  &__exit {
    width: auto;
  }

  &__profile {
    display: flex;
    align-items: center;
    gap: adaptiveValueFunc(32, 16, 3840, 320);
    font-size: adaptiveValueFunc(32, 16, 3840, 320);
  }
}

.header-profile-transition-enter-from,
.header-profile-transition-leave-to {
  opacity: 0;
}
</style>
