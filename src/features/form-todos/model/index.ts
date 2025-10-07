import { defineStore } from 'pinia';
import { ref, reactive, computed, nextTick, watch, toRaw, Ref, ComputedRef } from 'vue';
import { ElForm, ElNotification } from 'element-plus';
import { FORM_TODOS_RULEFORM, FORM_TODOS_ITEM } from '../constants';
import {
  saveTodosToLocalStorage,
  getTodosFromLocalStorage
} from '../api/requests';
import FormErrorHandler from '@/shared/error-handler/form-error-handler';
import { deepCopy, deepEqual } from '@/shared/composables';
import {
  RuleFormItem,
  RuleFormErrors,
  FormBodyDataItem,
  FormBody,
  FormState,
  FieldError
} from '../types';

export const useTodosForm = defineStore('todosForm', () => {
  // Constants
  const hasInitializationCompleted: Ref<boolean> = ref(false);
  const isLoading: Ref<boolean> = ref(false);
  const initialData: Ref<Record<string, RuleFormItem> | null> = ref(null);
  const isDeepEqual: Ref<boolean> = ref(true); // Initially true (form matches initial state when there's no initial data)

  const form = reactive<FormState>({
    name: 'form-todos',
    ruleForm: deepCopy(toRaw(FORM_TODOS_RULEFORM)) as Record<string, RuleFormItem>,
    ruleFormErrors: {},
    ruleFormRef: undefined,
    rules: {},
    body: {
      data: {}
    },
    isFormDisabled: true, // Initialize as true since initially there's no data
    isFormSubmitting: false,
    formHasError: false
  });

  // Get
  const getInitData = async (): Promise<void> => {
    try {
      const response = await getTodosFromLocalStorage();
      if ('todos' in response.data) {
        setFormData(response.data.todos);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
    setStateInitializationCompleted(true);
  };

  // Set
  const setRef = (formEl: InstanceType<typeof ElForm> | null): void => {
    if (!formEl) return;
    form.ruleFormRef = formEl;
  };

  const setStateFormHasError = (state: boolean): void => {
    form.formHasError = state;
  };

  const setFormServerError = (error: string): void => {
    form.ruleFormErrors.invalid_input = error;
  };

  const setStateFormSubmitting = (state: boolean): void => {
    form.isFormSubmitting = state;
  };

  const setStateInitializationCompleted = (state: boolean): void => {
    nextTick(() => (hasInitializationCompleted.value = state));
  };

  const setLoading = (state: boolean): void => {
    isLoading.value = state;
  };

  const setFormData = (data: Record<string, RuleFormItem>): void => {
    Object.entries(data).forEach(([key, item], index) => {
      addInitItem(index.toString(), item);
    });

    setInitialData();
  };

  const setInitialData = () => {
    // Create a completely independent copy using JSON methods to ensure no reactive links
    const formRuleFormRaw = toRaw(form.ruleForm);
    initialData.value = JSON.parse(JSON.stringify(formRuleFormRaw));
  };

  // Computed property to check if there are empty required fields
  const hasEmptyRequiredFields = computed<boolean>(() => {
    // Check each item in the form
    for (const [key, item] of Object.entries(form.ruleForm)) {
      // For todos, the 'text' field is required (as seen in the constants)
      if (item.text === '' || item.text === null || item.text === undefined) {
        return true; // Found an empty required field
      }
    }
    return false; // No empty required fields found
  });

  const updateFormEquality = () => {
    if (initialData.value) {
      const currentForm = toRaw(form.ruleForm);
      const initialForm = toRaw(initialData.value);
      const isEqual = deepEqual(currentForm, initialForm);
      isDeepEqual.value = isEqual;

      // Update form disabled state immediately
      form.isFormDisabled = (
        form.isFormSubmitting ||
        form.formHasError ||
        isEqual || // Disable form when there are no unsaved changes (form matches initial data)
        hasEmptyRequiredFields.value // Also disable if there are empty required fields
      );
    } else {
      // When there's no initial data, consider the form equal to initial state if it's empty
      const currentForm = toRaw(form.ruleForm);
      const isEmpty = Object.keys(currentForm).length === 0;
      isDeepEqual.value = isEmpty;
      form.isFormDisabled = (
        form.isFormSubmitting ||
        form.formHasError ||
        isEmpty || // Disable if form is empty (matches initial state)
        hasEmptyRequiredFields.value // Also disable if there are empty required fields
      );
    }
  };



  // Watcher to compare current form data with initial data
  watch(
    () => form.ruleForm,
    (newForm) => {
      if (initialData.value) {
        const isEqual = deepEqual(toRaw(newForm), toRaw(initialData.value));
        isDeepEqual.value = isEqual;
      } else {
        // When there's no initial data, check if the form is empty or has empty required fields
        const isEmpty = Object.keys(toRaw(newForm)).length === 0;
        isDeepEqual.value = isEmpty;
      }
      // Update form equality immediately when form data changes
      updateFormEquality();
    },
    { deep: true, flush: 'post' }
  );

  // Watcher to update form.isFormDisabled based on equality and other states
  watch(
    [() => isDeepEqual.value, () => form.isFormSubmitting, () => form.formHasError, hasEmptyRequiredFields],
    ([isEqual, isSubmitting, hasError, hasEmptyFields]) => {
      form.isFormDisabled = (
        isSubmitting ||
        hasError ||
        isEqual || // Disable form when there are no unsaved changes (form matches initial data)
        hasEmptyFields // Also disable if there are empty required fields
      );
    },
    { immediate: true }
  );

  const loading: ComputedRef<boolean> = computed(() => {
    return (
      !hasInitializationCompleted.value ||
      form.isFormSubmitting ||
      isLoading.value
    );
  });

  const bodyDataArray = computed({
    get: () => {
      return Object.entries(form.body.data).map(([key, items]) => ({
        key,
        items
      }));
    },
    set: (value) => {
      const newData = {} as FormBody['data'];
      const originalKeys: string[] = [];

      value.forEach((item, index) => {
        originalKeys.push(item.key);
        newData[index.toString()] = item.items;
      });

      // Update data reactively using Vue's reactivity system
      form.body.data = newData;

      // Update ruleForm and ruleFormErrors according to new order
      const newRuleForm = {} as Record<string, RuleFormItem>;
      const newRuleFormErrors = {} as RuleFormErrors;

      originalKeys.forEach((originalKey, newIndex) => {
        newRuleForm[newIndex.toString()] = form.ruleForm[originalKey];
        newRuleFormErrors[newIndex.toString()] = form.ruleFormErrors[originalKey];
      });

      // Update ruleForm and ruleFormErrors
      form.ruleForm = newRuleForm;
      form.ruleFormErrors = newRuleFormErrors;

      // Trigger form validation update to ensure Element Plus form component updates properly
      nextTick(() => {
        if (form.ruleFormRef) {
          // Clear and re-validate the entire form to ensure proper field mapping
          form.ruleFormRef.clearValidate?.();
          // If there are validation errors, re-validate to show them in correct positions
          validate();
        }
      });
    }
  });

  // Watch
  watch(
    () => form.formHasError,
    (hasError) => {
      if (!hasError) setFormServerError('');
    },
    { immediate: true }
  );


  // Reset
  const resetForm = (): void => {
    if (!form.ruleFormRef) return;
    form.ruleFormRef.resetFields?.();
  };

  const resetValidate = (): void => {
    if (!form.ruleFormRef) return;

    const hasServerErrors = Object.values(form.ruleFormErrors).some(element => {
      if (typeof element === 'string' && element.length) return true;
      if (typeof element === 'object' && element.status && element.status.length) return true;
      if (typeof element === 'object' && element.text && element.text.length) return true;
      return false;
    });

    if (!hasServerErrors) return;

    form.ruleFormRef.clearValidate?.();
    clearFormErrors();
    // Special handling for form-level errors
    form.ruleFormErrors.invalid_input = '';
  };

  // Submit
  const submit = async (ruleForm: Record<string, RuleFormItem>): Promise<void> => {
    setStateFormSubmitting(true);
    try {
      resetValidate();
      const response = await saveTodosToLocalStorage(ruleForm);
      if (response?.data?.success) {
        showSuccess();
        setInitialData();
        // Update form equality after setting initial data to reflect the new state
        updateFormEquality();
      }
    } catch (error: unknown) {
      // Handle server errors
      nextTick(() => setStateFormHasError(true));

      // Use the new error handler
      if (FormErrorHandler.isServerError(error)) {
        FormErrorHandler.handleServerErrors(form.ruleFormRef, error.data.errors, form.ruleFormErrors);
      } else {
        showErrorServer();
      }
    } finally {
      setStateFormSubmitting(false);
    }
  };

  // Notifications
  const showSuccess = (): void => {
    ElNotification({
      title: 'Сохранено',
      message: 'Задачи обновлены.',
      type: 'success',
      customClass: 'success',
    });
  };

  const showErrorServer = (): void => {
    ElNotification({
      title: 'Ошибка',
      message: 'Произошла ошибка сервера.',
      type: 'error',
      customClass: 'error',
    });
  };

  // Items
  const ruleFormItem: RuleFormItem = {
    status: false,
    text: ''
  };

  const ruleFormItemErrors: FieldError = {
    status: '',
    text: ''
  };

  const addItem = (): void => {
    // Find the next available numeric key to avoid conflicts after reordering and deletion
    const existingKeys = Object.keys(form.ruleForm).map(Number).filter(key => !isNaN(key));
    const maxKey = existingKeys.length > 0 ? Math.max(...existingKeys) : -1;
    const newIndex = maxKey + 1;

    const newIndexStr = newIndex.toString();
    form.ruleForm[newIndexStr] = { ...ruleFormItem };
    form.ruleFormErrors[newIndexStr] = { ...ruleFormItemErrors };
    form.body.data[newIndexStr] = FORM_TODOS_ITEM;

    // Update form equality after adding item to track changes properly
    updateFormEquality();
  };

  const addInitItem = (index: string | number, item: RuleFormItem): void => {
    const indexStr = index.toString();
    form.ruleForm[indexStr] = { ...item };
    form.ruleFormErrors[indexStr] = { ...ruleFormItemErrors };
    form.body.data[indexStr] = FORM_TODOS_ITEM;
  };

  const deleteItem = (index: string | number): void => {
    const indexStr = index.toString();
    delete form.body.data[indexStr];
    delete form.ruleFormErrors[indexStr];
    delete form.ruleForm[indexStr];

    // Ensure the form structure is properly updated
    // This helps prevent validation errors when the form still references deleted fields
  };

  // Actions
  const actionSave = async (): Promise<void> => {
    setLoading(true);
    const isValid = await validate();
    if (!form.formHasError && isValid) {
      await submit(form.ruleForm);
    }
    setLoading(false);
  };

  const actionAdd = async (): Promise<void> => {
    addItem();
    // Wait for the DOM to update with the new item
    await nextTick();
  };

  const actionDelete = async (index: string | number): Promise<void> => {
    setLoading(true);
    const indexStr = index.toString();

    // Clear validation for the specific fields before deleting them
    if (form.ruleFormRef) {
      // Get all field names associated with this index
      const fieldKeys = Object.keys(form.ruleForm[indexStr] || {});
      const fieldsToClear = fieldKeys.map(subField => `${indexStr}.${subField}`);

      // Clear validation for the deleted fields
      form.ruleFormRef?.clearValidate?.(fieldsToClear);
    }

    deleteItem(index);

    // Wait a tick to ensure DOM updates before validating
    await nextTick();

    setLoading(false);
  };

  // Validate
  const validate = async (): Promise<boolean> => {
    try {
      // Validate entire form
      const result = await form.ruleFormRef?.validate() ?? false;
      setStateFormHasError(false);
      return result;
    } catch (validationErrors: unknown) {
      // On validation error, set error flag
      setStateFormHasError(true);

      // Process validation errors using the new error handler
      if (validationErrors && typeof validationErrors === 'object') {
        // Clear previous errors
        clearFormErrors();

        // Use the new error handler to process validation errors
        FormErrorHandler.handleValidationErrors(form.ruleFormRef, validationErrors as Record<string, unknown>, form.ruleFormErrors);
      }

      return false;
    }
  };

  const validateBlur = async (_component: unknown, prop: string): Promise<void> => {
    try {
      // Validate only the specific field where the event occurred
      await form.ruleFormRef?.validateField(prop);
      setStateFormHasError(false);
    } catch (err) {
      setStateFormHasError(true);
    }
  };

  const validateChange = async (_component: unknown, prop: string): Promise<void> => {
    try {
      // Validate only the specific field where the event occurred
      await form.ruleFormRef?.validateField(prop);
      setStateFormHasError(false);
    } catch (err) {
      setStateFormHasError(true);
    }
  };

  // Helper functions
  const clearFormErrors = (): void => {
    FormErrorHandler.clearValidationErrors(form.ruleFormErrors);
  };

  return {
    // Data
    form,
    loading,
    bodyDataArray,
    // Init
    getInitData,
    setInitialData,
    updateFormEquality,
    // Actions
    actionSave,
    actionAdd,
    actionDelete,
    // Form
    setRef,
    resetForm,
    setStateFormHasError,
    setStateFormSubmitting,
    setStateInitializationCompleted,
    resetValidate,
    submit,
    // Notifications
    showSuccess,
    showErrorServer,
    // Validate
    validateBlur,
    validateChange
  };
});