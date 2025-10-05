import { RuleFormItem } from '../types';

// Types for API responses
interface ApiSuccessResponse<T> {
  data: T;
  statusCode: number;
}

interface ApiErrorResponse {
  data: {
    errors?: Record<string, string>;
    success?: boolean;
  };
  statusCode: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Types for data
interface TodosData {
  todos: Record<string, RuleFormItem>;
}

interface SaveTodosData {
  [key: string]: RuleFormItem;
}

export const saveTodosToLocalStorage = (
  todos: SaveTodosData
): Promise<ApiResponse<{ success: boolean }>> => {
  return new Promise((resolve, reject) => {
    try {
      // Validate input data
      if (
        !todos ||
        typeof todos !== 'object' ||
        Array.isArray(todos)
      ) {
        // For example (Server validation of entire form)
        reject({
          data: { errors: { invalid_input: 'Произошла ошибка формы' } },
          statusCode: 400
        });
        return;
      }

      // Sanitize data before storing
      const sanitizedTodos = JSON.parse(JSON.stringify(todos));
      
      localStorage.setItem('todos', JSON.stringify(sanitizedTodos));
      resolve({
        data: { success: true },
        statusCode: 200
      });
    } catch (error: unknown) {
      console.error('Error saving todos to localStorage:', error);
      // For example (Server validation of specific fields)
      reject({
        data: {
          errors: {
            '0.status': 'Что-то не так с чекбоксом',
            '0.text': 'Что-то не так с текстом'
          }
        },
        statusCode: 422
      });
    }
  });
};

export const getTodosFromLocalStorage = (): Promise<
  ApiResponse<TodosData>
> => {
  return new Promise((resolve, reject) => {
    try {
      const todos = localStorage.getItem('todos');

      if (!todos) {
        // Вместо ошибки возвращаем пустой объект
        resolve({
          data: { todos: {} },
          statusCode: 200
        });
        return;
      }

      // Validate and sanitize the retrieved data
      const parsedData = JSON.parse(todos);
      
      // Basic validation to ensure data structure is correct
      if (typeof parsedData !== 'object' || parsedData === null) {
        reject({
          data: { errors: { invalid_data: 'Некорректная структура данных' } },
          statusCode: 40
        });
        return;
      }

      resolve({
        data: { todos: parsedData },
        statusCode: 200
      });
    } catch (error: unknown) {
      console.error('Error getting todos from localStorage:', error);
      // Separate the JSON parsing error from other errors
      if (error instanceof SyntaxError) {
        reject({
          data: {
            errors: { general_error: 'Ошибка при разборе данных из LocalStorage' }
          },
          statusCode: 500
        });
      } else {
        reject({
          data: {
            errors: { general_error: 'Ошибка при чтении данных из LocalStorage' }
          },
          statusCode: 500
        });
      }
    }
  });
};