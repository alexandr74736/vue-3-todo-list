<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { ElForm, ElIcon } from 'element-plus';
import { Plus, Rank, Delete } from '@element-plus/icons-vue';
import { FormItem, Button, Draggable } from '@ui';
import { useTodosForm } from '../model/index';
import { storeToRefs } from 'pinia';
import type { FormBodyDataItem } from '../types';

const formStore = useTodosForm();
const { form, loading, bodyDataArray } = storeToRefs(formStore);
const {
  getInitData,
  setRef,
  submit,
  actionSave,
  actionAdd,
  actionDelete,
  validateChange,
  validateBlur
} = formStore;

const ruleFormRef = ref<InstanceType<typeof ElForm> | null>(null);
const labelPosition = ref<'top' | 'left' | 'right'>('top');

onMounted(async () => {
  await nextTick(async () => {
    setRef(ruleFormRef.value);
    await getInitData();
  });
});

// Computed property to properly type the body data array for the template
const typedBodyDataArray = computed<
  {
    key: string;
    items: FormBodyDataItem[];
  }[]
>({
  get: () => {
    return bodyDataArray.value.map((element) => ({
      key: element.key,
      items: element.items as FormBodyDataItem[]
    }));
  },
  set: (value) => {
    // When the value changes (due to drag/drop), update the original array
    const newBodyData = value.map((element) => ({
      key: element.key,
      items: element.items
    }));

    // Update the original bodyDataArray by assigning to it
    // The bodyDataArray is a computed with a setter in the store
    bodyDataArray.value = newBodyData as any;
  }
});
</script>

<template>
  <ElForm
    class="form"
    :class="{
      [`form_${form.name}`]: form.name && form.name.length > 0
    }"
    @submit.prevent="submit"
    :model="form.ruleForm"
    :label-position="labelPosition"
    label-width="auto"
    ref="ruleFormRef"
    v-loading="loading"
  >
    <div class="form__header">
      <div class="form__header-content">
        <h3 class="form__title">Задачи</h3>
        <div class="form__header-buttons">
          <Button
            class="form__button form__button--add"
            @click="actionAdd"
            type="default"
            :disabled="loading"
          >
            <ElIcon><component :is="Plus" /></ElIcon>
          </Button>
        </div>
      </div>
    </div>

    <div class="form__content">
      <Draggable
        v-model="typedBodyDataArray"
        :options="{
          animation: 200,
          handle: '.form__field-handle',
          itemKey: 'key'
        }"
        class="draggable-list"
      >
        <template #item="{ element, index }">
          <div class="form__field" :data-key="element.key">
            <template
              v-for="(fieldItem, fieldItemIndex) in element.items"
              :key="`form-item-${element.key}.${fieldItemIndex}`"
            >
              <template
                v-if="
                  typeof (fieldItem as FormBodyDataItem).prop === 'object' &&
                  (fieldItem as FormBodyDataItem).prop !== null
                "
              >
                <FormItem
                  :name="form.name"
                  :prop="`${element.key}.${((fieldItem as FormBodyDataItem).prop as { input: string; checkbox: string }).input}`"
                  v-bind="(fieldItem as FormBodyDataItem).itemAttributes"
                  :error="
                    typeof (fieldItem as FormBodyDataItem).prop === 'object'
                      ? (
                          form.ruleFormErrors[element.key] as Record<
                            string,
                            string
                          >
                        )?.[
                          (
                            (fieldItem as FormBodyDataItem).prop as {
                              input: string;
                            }
                          ).input
                        ]
                      : ''
                  "
                >
                  <component
                    :key="`component-${element.key}.${
                      (
                        (fieldItem as FormBodyDataItem).prop as {
                          input: string;
                        }
                      ).input
                    }`"
                    :name="form.name"
                    :is="(fieldItem as FormBodyDataItem).component"
                    v-bind="
                      (fieldItem as FormBodyDataItem).componentsAttributes
                    "
                    v-model="form.ruleForm[element.key]"
                    @update:model-value="
                      validateChange(
                        (fieldItem as FormBodyDataItem).component,
                        `${element.key}.${((fieldItem as FormBodyDataItem).prop as { input: string }).input}`
                      )
                    "
                    @blur="
                      validateBlur(
                        (fieldItem as FormBodyDataItem).component,
                        `${element.key}.${((fieldItem as FormBodyDataItem).prop as { input: string }).input}`
                      )
                    "
                  />
                </FormItem>
              </template>
            </template>

            <div class="form__field-handle">
              <Button class="form__drag" type="default">
                <ElIcon><component :is="Rank" /></ElIcon>
              </Button>
            </div>

            <div class="form__field-delete">
              <Button
                class="form__add"
                @click="actionDelete(element.key)"
                type="danger"
                :disabled="loading"
              >
                <ElIcon><component :is="Delete" /></ElIcon>
              </Button>
            </div>
          </div>
        </template>
      </Draggable>

      <FormItem
        v-if="form.ruleFormErrors?.invalid_input"
        name="invalid_input"
        prop="invalid_input"
        :error="form.ruleFormErrors?.invalid_input"
      />
    </div>

    <div class="form__footer">
      <Button
        class="form__button form__button--add"
        @click="actionSave"
        type="primary"
        :disabled="form.isFormDisabled"
        :loading="form.isFormSubmitting"
      >
        {{ form.isFormSubmitting ? 'Сохранение...' : 'Сохранить' }}
      </Button>
    </div>
  </ElForm>
</template>

<style lang="scss" scoped>
@use '@/app/styles/mixins.scss' as *;

.form {
  width: 100%;
  border-radius: 6px;
  background: var(--sb-white, #fff);
  display: flex;
  flex-direction: column;
  gap: adaptiveValueFunc(32, 16, 3840, 320);

  &__header {
    display: flex;
    flex-direction: column;
    gap: adaptiveValueFunc(24, 12, 3840, 320);
  }
  &__header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  &__title {
    font-size: adaptiveValueFunc(72, 20, 3840, 320);
  }
  &__add {
    flex-grow: 1;
  }
  &__drag {
    cursor: move;
  }
  &__content {
    display: flex;
    flex-direction: column;
  }
  &__field {
    display: flex;
    align-items: flex-start;
    gap: adaptiveValueFunc(12, 8, 3840, 320);

    :deep(.form__item) {
      flex-grow: 1;
    }
  }
  &__field-delete {
    margin-bottom: adaptiveValueFunc(36, 10, 3840, 320);
  }
  :deep(.el-form-item) {
    margin-bottom: adaptiveValueFunc(36, 18, 3840, 320);
  }
  :deep(.el-form-item__error) {
    margin-left: adaptiveValueFunc(98, 38, 3840, 320);
    font-size: adaptiveValueFunc(28, 10, 3840, 320);
  }
}
</style>
<style lang="scss">
@use '@/app/styles/mixins.scss' as *;
.el-notification.right {
  padding: adaptiveValueFunc(36, 12, 3840, 320)
    adaptiveValueFunc(72, 24, 3840, 320) adaptiveValueFunc(30, 10, 3840, 320)
    adaptiveValueFunc(42, 14, 3840, 320);

  .el-notification__icon {
    font-size: adaptiveValueFunc(36, 12, 3840, 320);
    height: adaptiveValueFunc(36, 12, 3840, 320);
    width: adaptiveValueFunc(36, 12, 3840, 320);
  }

  .el-notification__group {
    margin-left: adaptiveValueFunc(36, 12, 3840, 320);
    margin-right: adaptiveValueFunc(36, 12, 3840, 320);
  }

  .el-notification__title {
    font-size: adaptiveValueFunc(36, 12, 3840, 320);
    line-height: 100%;
  }

  .el-notification__content {
    font-size: adaptiveValueFunc(36, 12, 3840, 320);
    line-height: 100%;
    margin-top: adaptiveValueFunc(36, 12, 3840, 320);
  }

  .el-notification__closeBtn {
    font-size: adaptiveValueFunc(36, 12, 3840, 320);
    right: adaptiveValueFunc(36, 15, 3840, 320);
    top: adaptiveValueFunc(36, 18, 3840, 320);
  }
}
</style>
