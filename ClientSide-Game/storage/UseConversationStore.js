import create from 'zustand';
import { persist } from 'zustand/middleware'

const useConversetionStore = create(persist((set) => ({

  conversetions: [], // Initial conversation state

  addConversetion: (conversation) => set((state) => ({ conversetions: [...state.conversetions, conversation] })), // Function to set conversation data
  
}),{
name: 'ConversetionsStorage', // unique name for localStorage key
getStorage: () => localStorage // define localStorage as storage location
}))



export default useConversetionStore;