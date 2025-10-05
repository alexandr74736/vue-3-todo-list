import type { UserResponse } from '@/entities/user/model/types';
import type { ApiResponse } from '@/types/api';

// Define a function to create a fake user instance
const createFakeUserInstance = () => ({
  user: {
    id: '1',
    username: 'fake_user',
    email: 'fake@example.com',
    role: 'user',
    isAdmin: false
  }
});

// Export a function that creates a new instance each time (for better testability)
export const useFakeUser = (userInstance = createFakeUserInstance()) => {
  const getFakeUser = async (): Promise<ApiResponse<UserResponse>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const fakeUserData: UserResponse = { user: userInstance.user };
    return {
      data: fakeUserData,
      statusCode: 200
    };
  };

  return {
    getFakeUser
  };
};

// Export a default instance for backward compatibility
export const defaultFakeUser = useFakeUser();