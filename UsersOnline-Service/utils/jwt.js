import jwt from 'jsonwebtoken';

export const getUserNameFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const decoded = jwt.decode(token);
      return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    }
    console.error('Failed to decode or verify JWT:', error);
    return null;
  }
};