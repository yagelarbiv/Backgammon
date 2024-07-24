import { getAllUsers, getCleanedUsers, setAllUsers, updateUserStatus } from '../utils/users.js';

describe('User Management Functions', () => {
  beforeEach(() => {
    setAllUsers([]); // Reset allUsers before each test
  });

  test('should get all users', () => {
    const users = [{ name: 'Alice', online: true, socketConnection: {} }];
    setAllUsers(users);
    expect(getAllUsers()).toEqual(users);
  });

  test('should set all users', () => {
    const users = [{ name: 'Bob', online: false, socketConnection: {} }];
    setAllUsers(users);
    expect(getAllUsers()).toEqual(users);
  });

  test('should update user status if user exists', () => {
    const users = [{ name: 'Alice', online: true, socketConnection: {} }];
    setAllUsers(users);
    const result = updateUserStatus('Alice', false, {});
    expect(result).toBe(false);
    expect(getAllUsers()[0].online).toBe(false);
  });

  test('should add new user if user does not exist', () => {
    const users = [{ name: 'Bob', online: false, socketConnection: {} }];
    setAllUsers(users);
    const result = updateUserStatus('Charlie', true, {});
    expect(result).toBe(true);
    expect(getAllUsers().length).toBe(2);
    expect(getAllUsers()[1].name).toBe('Charlie');
  });

  test('should return cleaned users', () => {
    const users = [
      { name: 'Alice', online: true, socketConnection: {} },
      { name: 'Bob', online: false, socketConnection: {} }
    ];
    setAllUsers(users);
    const cleanedUsers = getCleanedUsers();
    expect(cleanedUsers).toEqual([
      { name: 'Alice', online: true },
      { name: 'Bob', online: false }
    ]);
  });
});