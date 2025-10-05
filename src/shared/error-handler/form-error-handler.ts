import type { FieldError } from '@/features/form-todos/types';
import type { ElForm } from 'element-plus';

// Define error types
type ValidationError = {
  type: 'validation';
  field: string;
  message: string;
};

type ServerError = {
  type: 'server';
  field?: string;
  message: string;
};

type FormError = ValidationError | ServerError;

// Error handler for form-related errors
class FormErrorHandler {
  // Handle validation errors
  static handleValidationErrors(
    formRef: InstanceType<typeof ElForm> | undefined,
    errors: Record<string, unknown>,
    ruleFormErrors: Record<string, FieldError | string>
  ): void {
    // Clear previous validation errors
    this.clearValidationErrors(ruleFormErrors);
    
    // Process validation errors and set them in form.ruleFormErrors
    Object.entries(errors).forEach(([field, errorDetails]) => {
      const [index, subField] = field.split('.');
      if (index && subField) {
        // Ensure the error field exists as an object
        if (!ruleFormErrors[index] || typeof ruleFormErrors[index] === 'string') {
          ruleFormErrors[index] = { status: '', text: '' };
        }

        // Set error text for specific field
        if (typeof ruleFormErrors[index] !== 'string') {
          const errorMessage = this.extractErrorMessage(errorDetails);
          (ruleFormErrors[index] as FieldError)[subField] = errorMessage;
          
          // Validate the specific field if form reference is available
          if (formRef) {
            formRef.validateField(field, () => {});
          }
        }
      }
    });
  }

  // Handle server errors
  static handleServerErrors(
    formRef: InstanceType<typeof ElForm> | undefined,
    serverErrors: Record<string, string>,
    ruleFormErrors: Record<string, FieldError | string>
  ): void {
    Object.entries(serverErrors).forEach(([field, errorMessage]) => {
      // Form errors
      if (field === 'invalid_input') {
        ruleFormErrors.invalid_input = errorMessage;
        return;
      }

      // Field errors
      const [firstPart, secondPart] = field.split('.');
      if (firstPart in ruleFormErrors && secondPart) {
        // Check if there's a corresponding element in body.data with object prop
        // If secondPart matches checkbox or input field
        if (typeof ruleFormErrors[firstPart] !== 'string') {
          (ruleFormErrors[firstPart] as FieldError)[secondPart] = errorMessage;
          
          // Validate the specific field if form reference is available
          if (formRef) {
            formRef.validateField(field, () => {});
          }
        }
      }
    });
  }

  // Clear validation errors
  static clearValidationErrors(ruleFormErrors: Record<string, FieldError | string>): void {
    Object.keys(ruleFormErrors).forEach(key => {
      if (typeof ruleFormErrors[key] === 'object') {
        const errorObj = ruleFormErrors[key] as FieldError;
        errorObj.status = '';
        errorObj.text = '';
      }
    });
  }

 // Extract error message from error details
  static extractErrorMessage(errorDetails: unknown): string {
    const errorArray = Array.isArray(errorDetails) ? errorDetails : [errorDetails];
    const firstError = errorArray[0];
    return (typeof firstError === 'object' && firstError && 'message' in firstError) 
      ? (firstError as { message?: string }).message || 'Validation error' 
      : 'Validation error';
  }

 // Check if error is a server error with specific structure
  static isServerError(error: unknown): error is { data: { errors: Record<string, string> } } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'data' in error &&
      typeof (error as { data?: { errors?: unknown } }).data === 'object' &&
      (error as { data?: { errors?: unknown } }).data !== null &&
      (error as { data?: { errors?: unknown } }).data?.errors !== undefined &&
      typeof (error as { data?: { errors?: unknown } }).data?.errors === 'object'
    );
  }
}

export default FormErrorHandler;