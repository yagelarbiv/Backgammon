import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { setupSocketHandlers } from '../socketHandlers.js';

describe('setupSocketHandlers', () => {
  let mockUsers;

  beforeAll(async () => {
    mockUsers = await import('../utils/users.js');
    jest.mock('../utils/users.js', () => mockUsers);
  });

  let mockIo;
  let mockSocket;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock Socket.IO instance
    mockSocket = {
      emit: jest.fn(),
      on: jest.fn(),
    };

    mockIo = {
      on: jest.fn(),
      emit: jest.fn(),
    };

    // Mock the 'connection' event
    mockIo.on.mockImplementation((event, callback) => {
      if (event === 'connection') {
        callback(mockSocket);
      }
    });

    // Mock getCleanedUsers
    getCleanedUsers.mockReturnValue(['cleanedUser1', 'cleanedUser2']);

    // Mock getAllUsers
    getAllUsers.mockReturnValue([
      { name: 'user1', socketConnection: mockSocket },
      { name: 'user2', socketConnection: {} },
    ]);
  });

  it('should set up connection handler', () => {
    setupSocketHandlers(mockIo);

    expect(mockIo.on).toHaveBeenCalledWith('connection', expect.any(Function));
  });

  it('should emit all users on connection', () => {
    setupSocketHandlers(mockIo);

    expect(mockSocket.emit).toHaveBeenCalledWith('allUsers', ['cleanedUser1', 'cleanedUser2']);
  });

  it('should handle disconnect event', () => {
    setupSocketHandlers(mockIo);

    // Simulate disconnect event
    const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect')[1];
    disconnectHandler();

    expect(updateUserStatus).toHaveBeenCalledWith('user1', false, null);
    expect(mockIo.emit).toHaveBeenCalledWith('allUsers', ['cleanedUser1', 'cleanedUser2']);
  });

  it('should not update user status if user not found on disconnect', () => {
    getAllUsers.mockReturnValue([{ name: 'user2', socketConnection: {} }]);

    setupSocketHandlers(mockIo);

    // Simulate disconnect event
    const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect')[1];
    disconnectHandler();

    expect(updateUserStatus).not.toHaveBeenCalled();
    expect(mockIo.emit).not.toHaveBeenCalled();
  });
});