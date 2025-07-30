import { describe, it, expect, beforeEach, vi } from 'vitest';

// Create a mock axios instance that the actual api.js will use
const mockAxiosInstance = {
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() }
  },
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
};

// Mock axios completely
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance)
  }
}));

// Import after mocking
const { userAPI, activityAPI, registrationAPI } = await import('../../src/services/api');

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('userAPI', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        success: true,
        data: { user: { id: 1, username: 'test' }, token: 'token123' }
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await userAPI.login({ username: 'test', password: 'password' });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users/login', {
        username: 'test',
        password: 'password'
      });
      expect(result).toEqual(mockResponse);
    });

    it('should register successfully', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com'
      };
      const mockResponse = {
        success: true,
        data: { id: 1, username: 'testuser' }
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await userAPI.register(userData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users/register', userData);
      expect(result).toEqual(mockResponse);
    });

    it('should get user info successfully', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, username: 'test', email: 'test@example.com' }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await userAPI.getUserInfo(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual(mockResponse);
    });

    it('should handle login error', async () => {
      const mockError = new Error('Login failed');
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(userAPI.login({ username: 'test', password: 'wrong' }))
        .rejects.toThrow('Login failed');
    });
  });

  describe('activityAPI', () => {
    it('should get activities successfully', async () => {
      const params = { page: 1, limit: 10 };
      const mockResponse = {
        success: true,
        data: {
          activities: [{ id: 1, title: 'Test Activity' }],
          total: 1
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await activityAPI.getActivities(params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/activities', { params });
      expect(result).toEqual(mockResponse);
    });

    it('should get activity detail successfully', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, title: 'Test Activity' }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await activityAPI.getActivityDetail(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/activities/1');
      expect(result).toEqual(mockResponse);
    });

    it('should create activity successfully', async () => {
      const activityData = {
        title: 'New Activity',
        description: 'Test description'
      };
      const mockResponse = {
        success: true,
        data: { id: 1, ...activityData }
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await activityAPI.createActivity(activityData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/activities', activityData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('registrationAPI', () => {
    it('should register for activity successfully', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, activityId: 1, userId: 1 }
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await registrationAPI.registerActivity({ activityId: 1 });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/registrations', { activityId: 1 });
      expect(result).toEqual(mockResponse);
    });

    it('should get my registrations successfully', async () => {
      const mockResponse = {
        success: true,
        data: [{ id: 1, activityId: 1, userId: 1 }]
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await registrationAPI.getMyRegistrations();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/registrations/my');
      expect(result).toEqual(mockResponse);
    });

    it('should cancel registration successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Registration cancelled'
      };
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await registrationAPI.cancelRegistration(1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/registrations/activity/1');
      expect(result).toEqual(mockResponse);
    });
  });
});