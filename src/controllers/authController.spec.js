import { jest } from '@jest/globals';

describe('AuthController', () => {
  let authController;
  let mockAuthService;
  let req, res, next;

  beforeAll(async () => {
    // Create mocks
    mockAuthService = {
      registerUser: jest.fn(),
      loginUser: jest.fn(),
      logoutUser: jest.fn(),
    };

    // Mock modules using dynamic import approach
    jest.unstable_mockModule('../db/connection.js', () => ({
      default: {
        authenticate: jest.fn().mockResolvedValue(),
        close: jest.fn().mockResolvedValue(),
        sync: jest.fn().mockResolvedValue(),
        query: jest.fn().mockResolvedValue([]),
      },
    }));

    jest.unstable_mockModule('../services/authService.js', () => mockAuthService);

    // Import the controller after mocking
    authController = await import('./authController.js');
  });

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 'user123' },
      file: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockAuthService.registerUser.mockResolvedValue(mockUser);

      req.body = { email: 'test@example.com', password: 'password123' };

      await authController.register(req, res, next);

      expect(mockAuthService.registerUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle registration errors', async () => {
      const error = new Error('Registration failed');
      mockAuthService.registerUser.mockRejectedValue(error);

      req.body = { email: 'test@example.com', password: 'password123' };

      await authController.register(req, res, next);

      expect(mockAuthService.registerUser).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
