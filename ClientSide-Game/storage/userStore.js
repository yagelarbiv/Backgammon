import create from 'zustand';
import { persist } from 'zustand/middleware'

const useUserStore = create(persist((set) => ({

  user: null, // Initial user state
  setuser: (userData) => set({ user: userData }), // Function to set user data

}),{
name: 'userStorage', // unique name for localStorage key
getStorage: () => localStorage // define localStorage as storage location
}))



export default useUserStore;
