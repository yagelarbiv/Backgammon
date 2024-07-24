import { jest, describe, it, expect } from '@jest/globals';
import { getUserNameFromToken } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JWT Functions', () => {
  it('should return user name from valid token', () => {
    const mockToken = 'valid.token.here';
    const mockDecodedToken = { 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'testuser' };

    jwt.verify = jest.fn().mockReturnValue(mockDecodedToken);

    const result = getUserNameFromToken(mockToken);

    expect(result).toBe('testuser');
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
  });

  it('should return user name from expired token', () => {
    const mockToken = 'expired.token.here';
    const mockDecodedToken = { 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'expireduser' };

    jwt.verify = jest.fn().mockImplementation(() => {
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';
      throw error;
    });

    jwt.decode = jest.fn().mockReturnValue(mockDecodedToken);

    const result = getUserNameFromToken(mockToken);

    expect(result).toBe('expireduser');
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
    expect(jwt.decode).toHaveBeenCalledWith(mockToken);
  });

  it('should return null for invalid token', () => {
    const mockToken = 'invalid.token.here';

    jwt.verify = jest.fn().mockImplementation(() => {
      throw new Error('Invalid token');
    });

    jwt.decode = jest.fn().mockReturnValue(null);

    const result = getUserNameFromToken(mockToken);

    expect(result).toBeNull();
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
    expect(jwt.decode).not.toHaveBeenCalled();
  });
});