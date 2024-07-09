import { getCleanedUsers, updateUserStatus, getAllUsers } from './utils/users.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('allUsers', getCleanedUsers());

    socket.on('disconnect', () => {
      const user = getAllUsers().find(u => u.socketConnection === socket);
      if (user) {
        updateUserStatus(user.name, false, null);
        io.emit('allUsers', getCleanedUsers());
      }
    });
  });
};