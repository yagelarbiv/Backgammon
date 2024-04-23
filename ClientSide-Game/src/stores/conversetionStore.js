import create from 'zustand';
import { persist } from 'zustand/middleware'

const useConversetionStore = create(persist((set) => ({

  conversetions: [], // Initial conversation state

  getConversationMessages: (id) => set((state) => ({ conversetions: state.conversetions.map((c) => c.id === id ? c.messages : c) })), // Function to get conversation messages

  addConversetion: (conversation) => set((state) => ({ conversetions: [...state.conversetions, conversation] })), // Function to set conversation data
  
  updateConversetion: (conversation) => set((state) => ({ conversetions: state.conversetions.map((c) => c.id === conversation.id ? conversation : c) })), // Function to update conversation data

}),{
name: 'ConversetionsStorage', // unique name for localStorage key
getStorage: () => localStorage // define localStorage as storage location
}))



export default useConversetionStore;