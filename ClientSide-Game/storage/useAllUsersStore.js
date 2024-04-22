import create from 'zustand';
import { persist } from 'zustand/middleware';

const useAllUsersStore = create(persist((set) => ({
  allUsers: [],
  setAllUsers: (users) => set({ allUsers: users }),
}), {
  name: 'AllUsersStorage', // unique name for localStorage key
  getStorage: () => localStorage, // define localStorage as storage location
}));

export default useAllUsersStore;