import type { ElForm, FormRules } from 'element-plus';
import type { Component } from 'vue';

// Type for individual error element
export interface FieldError {
  [key: string]: string | undefined;
  status?: string;
  text?: string;
}

// Type for form errors
export type RuleFormErrors = Record<string, FieldError | string> & {
  invalid_input?: string;
};

// Type for form element
export type PropType = {
  checkbox: string;
 input: string;
} | string;

// Type form element data
export interface FormBodyDataItem {
  prop: PropType;
  component: Component;
  itemAttributes: Record<string, unknown>;
  componentsAttributes: Record<string, unknown>;
}

// Type for form body
export interface FormBody {
  data: Record<string, FormBodyDataItem[]>;
}

// Type for form item
export interface RuleFormItem {
  status: boolean;
  text: string;
}

// Type for form item with detailed prop
export interface FieldItem extends FormBodyDataItem {
  prop: {
    checkbox: string;
    input: string;
  } | string;
}

// Type for form state
export interface FormState {
 name: string;
 ruleForm: Record<string, RuleFormItem>;
  ruleFormErrors: RuleFormErrors;
  ruleFormRef: InstanceType<typeof ElForm> | undefined;
  rules: FormRules;
  body: FormBody;
  isFormDisabled: boolean;
  isFormSubmitting: boolean;
  formHasError: boolean;
}