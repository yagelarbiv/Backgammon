import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const useAllUsersStore = create(persist((set) => ({
  allUsers: [],
  setAllUsers: (users) => set({ allUsers: users }),
}), {
  name: 'AllUsersStorage', 
  getStorage: () => localStorage, 
}));

export default useAllUsersStore;