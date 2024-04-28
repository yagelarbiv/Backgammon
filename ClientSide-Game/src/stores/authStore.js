import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(persist((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  refreshToken: null,
  setRefreshToken: (token) => set({ refreshToken: token }),

}), {
  name: 'AuthStorage', // unique name for localStorage key
  getStorage: () => localStorage, // define localStorage as storage location
}));

export default useAuthStore;