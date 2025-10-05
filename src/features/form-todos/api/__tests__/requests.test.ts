import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { saveTodosToLocalStorage, getTodosFromLocalStorage } from '../requests';
import type { RuleFormItem } from '../../types';

// Mock RuleFormItem type for testing
type MockRuleFormItem = RuleFormItem;

describe('Form Todos API Requests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('saveTodosToLocalStorage', () => {
    it('should save todos to localStorage successfully', async () => {
      const todos = {
        '1': { text: 'Test todo', status: false } as MockRuleFormItem,
        '2': { text: 'Another todo', status: true } as MockRuleFormItem
      };

      const result = await saveTodosToLocalStorage(todos);

      expect(result).toEqual({
        data: { success: true },
        statusCode: 200
      });

      const savedData = localStorage.getItem('todos');
      expect(savedData).toBe(JSON.stringify(todos));
    });

    it('should reject with error when todos is null', async () => {
      await expect(saveTodosToLocalStorage(null as any)).rejects.toEqual({
        data: { errors: { invalid_input: 'Произошла ошибка формы' } },
        statusCode: 400
      });
    });

    it('should reject with error when todos is undefined', async () => {
      await expect(saveTodosToLocalStorage(undefined as any)).rejects.toEqual({
        data: { errors: { invalid_input: 'Произошла ошибка формы' } },
        statusCode: 400
      });
    });

    it('should reject with error when todos is an array', async () => {
      await expect(saveTodosToLocalStorage([] as any)).rejects.toEqual({
        data: { errors: { invalid_input: 'Произошла ошибка формы' } },
        statusCode: 400
      });
    });

    it('should reject with error when todos is a primitive', async () => {
      await expect(saveTodosToLocalStorage('not-an-object' as any)).rejects.toEqual({
        data: { errors: { invalid_input: 'Произошла ошибка формы' } },
        statusCode: 400
      });
    });

    it('should reject with error when localStorage throws', async () => {
      // Create a spy on localStorage.setItem to throw an error
      const setItemSpy = vi.spyOn(localStorage, 'setItem')
        .mockImplementation(() => {
          throw new Error('Quota exceeded');
        });

      const todos = {
        '1': { text: 'Test todo', status: false } as MockRuleFormItem
      };

      await expect(saveTodosToLocalStorage(todos)).rejects.toEqual({
        data: {
          errors: {
            '0.status': 'Что-то не так с чекбоксом',
            '0.text': 'Что-то не так с текстом'
          }
        },
        statusCode: 422
      });

      setItemSpy.mockRestore();
    });
  });

  describe('getTodosFromLocalStorage', () => {
    it('should retrieve todos from localStorage successfully', async () => {
      const todos = {
        '1': { text: 'Test todo', status: false } as MockRuleFormItem,
        '2': { text: 'Another todo', status: true } as MockRuleFormItem
      };
      
      localStorage.setItem('todos', JSON.stringify(todos));

      const result = await getTodosFromLocalStorage();

      expect(result).toEqual({
        data: { todos },
        statusCode: 200
      });
    });

    it('should reject with error when no data in localStorage', async () => {
      await expect(getTodosFromLocalStorage()).rejects.toEqual({
        data: { errors: { no_data: 'Нет данных в LocalStorage' } },
        statusCode: 404
      });
    });

    it('should reject with error when JSON parsing fails', async () => {
      localStorage.setItem('todos', 'invalid json');

      await expect(getTodosFromLocalStorage()).rejects.toEqual({
        data: {
          errors: { general_error: 'Ошибка при разборе данных из LocalStorage' }
        },
        statusCode: 500
      });
    });

    it('should reject with error when other parsing error occurs', async () => {
      // First set some data in localStorage
      localStorage.setItem('todos', JSON.stringify({ '1': { text: 'Test todo', status: false } }));
      
      // Create a spy on localStorage.getItem to throw an error
      const getItemSpy = vi.spyOn(localStorage, 'getItem')
        .mockImplementation(() => {
          throw new Error('Other parsing error');
        });

      await expect(getTodosFromLocalStorage()).rejects.toEqual({
        data: {
          errors: { general_error: 'Ошибка при чтении данных из LocalStorage' }
        },
        statusCode: 500
      });

      getItemSpy.mockRestore();
    });
  });
});