
import create from 'zustand';
import { persist } from 'zustand/middleware'

const useUserStore = create(persist((set) => ({

  user: null, 
  setuser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
}),{
name: 'userStorage', 
getStorage: () => localStorage 
}))


export default useUserStore;
