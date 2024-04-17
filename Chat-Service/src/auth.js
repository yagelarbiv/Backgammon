import jwt from 'jsonwebtoken';

const getUserNameFromToken = (token) => {
  try {
    // Verify the token using the same secret key used to create the token
    const decoded = jwt.verify(token, 'your_access_token_secret');
    return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  } catch (error) {
    console.error("Failed to decode or verify JWT:", error);
    return null;
  }
};
