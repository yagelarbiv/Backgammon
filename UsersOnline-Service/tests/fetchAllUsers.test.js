import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import axios from 'axios';
import { fetchAllUsers } from '../services/userService.js';

jest.mock('axios');

// Then, in your beforeEach or before each test where you need it
beforeEach(() => {
  jest.clearAllMocks(); // Clears any previous mocking behavior

  // Ensure axios.get is a mock function
  axios.get = jest.fn();

  // Now you can use mockResolvedValue since axios.get is explicitly a mock function
  axios.get.mockResolvedValue(mockResponse);
});

// Mock the entire users module
jest.mock('../utils/users.js', () => ({
  getAllUsers: jest.fn(),
  setAllUsers: jest.fn(),
}), { virtual: true });

// Import the mocked functions after mocking
import { getAllUsers, setAllUsers } from '../utils/users.js';


const mockUsers = ['user1', 'user2'];
const mockResponse = {
  data: mockUsers,
};

const mockCurrentUsers = [
  { name: 'user1', online: true },
  { name: 'user3', online: false },
];

describe('fetchAllUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue(mockResponse);
    getAllUsers.mockReturnValue(mockCurrentUsers);
  });

  it('should fetch users and update state correctly', async () => {
    await fetchAllUsers();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(`${process.env.API_URL}/api/auth/all-users`);
    
    const expectedUpdatedUsers = [
      { name: 'user1', online: true },
      { name: 'user2', online: false },
    ];

    expect(setAllUsers).toHaveBeenCalledWith(expectedUpdatedUsers);
  });

  it('should handle errors', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    
    await fetchAllUsers();
    
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});