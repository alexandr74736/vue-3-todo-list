import { FormInputCheckbox } from '@/shared/ui/form';
import { FormBodyDataItem } from '../../types';
import { shallowRef } from 'vue';

export const FORM_TODOS_ITEM: FormBodyDataItem[] = [
  {
    prop: {
      checkbox: 'status',
      input: 'text'
    },
    component: shallowRef(FormInputCheckbox),
    itemAttributes: {
      required: true,
      rules: {
        required: true,
        message: 'Пожалуйста, заполните поле',
        trigger: 'blur'
      }
    },
    componentsAttributes: {
      label: ''
    }
  }
];