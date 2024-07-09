import axios from 'axios';
import https from 'https';
import { API_URL } from '../config.js';
import { setAllUsers, getAllUsers } from '../utils/users.js';

export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/all-users`, {
      headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
      withCredentials: true,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    const currentUsers = getAllUsers();
    const updatedUsers = response.data.map(user => ({
      name: user,
      online: currentUsers.find(u => u.name === user)?.online || false,
    }));

    setAllUsers(updatedUsers);
    console.log('All users:', updatedUsers);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};