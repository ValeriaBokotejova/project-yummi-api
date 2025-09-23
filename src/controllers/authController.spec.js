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
      req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({});
      expect(next).not.toHaveBeenCalled();
    });
  });
});
