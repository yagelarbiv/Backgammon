import create from 'zustand';

const useUserStore = create((set) => ({
  user: null, // Initial user state
  setUser: (userData) => set({ user: userData }), // Function to set user data
}));

export default useUserStore;
