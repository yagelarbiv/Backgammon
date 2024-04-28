import {create} from 'zustand';
import { persist } from 'zustand/middleware'

const useConversetionStore = create(persist((set,get) => ({

  conversetions: [], // Initial conversation state

  getConversationWithUser:(user) => {
    const conversations = get().conversetions;
    return conversations.find(c => c.users.some(u => u.name === user.name));
  },
  getConversationMessages: (id) => set((state) => ({ conversetions: state.conversetions.map((c) => c.id === id ? c.messages : c) })), // Function to get conversation messages

  addConversation: (conversation) => set((state) => ({ conversetions: [...state.conversetions, conversation] })), // Function to set conversation data
  
  updateConversetion: (conversation) => set((state) => ({ conversetions: state.conversetions.map((c) => c.id === conversation.id ? conversation : c) })), // Function to update conversation data
  addMessageToConversation: (id, message) => set((state) => ({ conversetions: state.conversetions.map((c) => c.id === id ? { ...c, messages: [...c.messages, message] } : c) })), // Function to add message to conversation

}),{
name: 'ConversetionsStorage', // unique name for localStorage key
getStorage: () => localStorage // define localStorage as storage location
}))



export default useConversetionStore;