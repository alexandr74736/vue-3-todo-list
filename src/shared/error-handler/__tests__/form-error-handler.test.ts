import { describe, expect, test, vi } from 'vitest';
import FormErrorHandler from '../form-error-handler';

describe('FormErrorHandler', () => {
  test('should handle validation errors correctly', () => {
    const mockFormRef = {
      validateField: vi.fn()
    };
    
    const ruleFormErrors = {
      '0': { status: '', text: '' },
      '1': { status: '', text: '' }
    };
    
    const errors = {
      '0.status': [{ message: 'Status is required' }],
      '1.text': [{ message: 'Text is required' }]
    };
    
    FormErrorHandler.handleValidationErrors(mockFormRef as any, errors as any, ruleFormErrors);
    
    expect(ruleFormErrors['0'].status).toBe('Status is required');
    expect(ruleFormErrors['1'].text).toBe('Text is required');
    expect(mockFormRef.validateField).toHaveBeenCalledTimes(2);
  });

  test('should handle server errors correctly', () => {
    const mockFormRef = {
      validateField: vi.fn()
    };
    
    const ruleFormErrors = {
      '0': { status: '', text: '' },
      '1': { status: '', text: '' },
      invalid_input: ''
    };
    
    const serverErrors = {
      '0.status': 'Invalid status value',
      '1.text': 'Invalid text value',
      'invalid_input': 'Form submission error'
    };
    
    FormErrorHandler.handleServerErrors(mockFormRef as any, serverErrors, ruleFormErrors);
    
    expect(ruleFormErrors['0'].status).toBe('Invalid status value');
    expect(ruleFormErrors['1'].text).toBe('Invalid text value');
    expect(ruleFormErrors.invalid_input).toBe('Form submission error');
    expect(mockFormRef.validateField).toHaveBeenCalledTimes(2);
  });

  test('should clear validation errors', () => {
    const ruleFormErrors = {
      '0': { status: 'error1', text: 'error2' },
      '1': { status: 'error3', text: 'error4' }
    };
    
    FormErrorHandler.clearValidationErrors(ruleFormErrors);
    
    expect(ruleFormErrors['0'].status).toBe('');
    expect(ruleFormErrors['0'].text).toBe('');
    expect(ruleFormErrors['1'].status).toBe('');
    expect(ruleFormErrors['1'].text).toBe('');
  });

  test('should extract error message correctly', () => {
    const errorDetails1 = [{ message: 'Test error message' }];
    const errorDetails2 = { message: 'Single error message' };
    const errorDetails3 = 'Simple error string';
    
    const message1 = FormErrorHandler.extractErrorMessage(errorDetails1);
    const message2 = FormErrorHandler.extractErrorMessage(errorDetails2);
    const message3 = FormErrorHandler.extractErrorMessage(errorDetails3);
    
    expect(message1).toBe('Test error message');
    expect(message2).toBe('Single error message');
    expect(message3).toBe('Validation error');
  });

  test('should identify server errors correctly', () => {
    const validServerError = {
      data: {
        errors: {
          field1: 'error1',
          field2: 'error2'
        }
      }
    };
    
    const invalidError = {
      message: 'Simple error'
    };
    
    const result1 = FormErrorHandler.isServerError(validServerError);
    const result2 = FormErrorHandler.isServerError(invalidError);
    
    expect(result1).toBe(true);
    expect(result2).toBe(false);
  });
});