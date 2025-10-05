export interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  isAdmin: boolean;
  // другие поля пользователя
}

export interface UserResponse {
  user: UserData;
}