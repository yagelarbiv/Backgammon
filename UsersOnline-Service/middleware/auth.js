import { getUserNameFromToken } from '../utils/jwt.js';
import { updateUserStatus, getCleanedUsers } from '../utils/users.js';

export const setupSocketAuth = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const userName = getUserNameFromToken(token);
    if (!userName) {
      return next(new Error('Invalid token'));
    }

    console.log('Authenticated user:', userName);
    const isNewUser = updateUserStatus(userName, true, socket);
    if (isNewUser) {
      io.emit('allUsers', getCleanedUsers());
    }
    next();
  });
};