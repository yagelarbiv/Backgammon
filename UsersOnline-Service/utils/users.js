let allUsers = [];

export const getAllUsers = () => allUsers;

export const setAllUsers = (users) => {
  allUsers = users;
};

export const updateUserStatus = (userName, isOnline, socket) => {
  const userIndex = allUsers.findIndex(user => user.name === userName);
  if (userIndex !== -1) {
    allUsers[userIndex].online = isOnline;
    allUsers[userIndex].socketConnection = socket;
  } else {
    allUsers.push({ name: userName, online: isOnline, socketConnection: socket });
  }
  return userIndex === -1;
};

export const getCleanedUsers = () => {
  return allUsers.map(({ name, online }) => ({ name, online }));
};