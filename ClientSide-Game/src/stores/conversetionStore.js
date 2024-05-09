import create from 'zustand';
import { persist } from 'zustand/middleware'


const useConversetionStore = create(persist((set,get) => ({

  hasUnreadMessages: false,

  sethasUnreadMessages: (flag) => set({ hasUnreadMessages: flag }),
  
}),{
name: 'ConversetionsStorage', 
getStorage: () => localStorage 
}))



export default useConversetionStore;