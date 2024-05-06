import create from 'zustand';
import { persist } from 'zustand/middleware'


const useConversetionStore = create(persist((set,get) => ({

  // conversetions: [], // Initial conversation state
  hasUnreadMessages: false,

  // getConversationWithUser: (user) => {
  //   const conversations = get().conversetions;
  //   return conversations.find(c =>
  //     c.users.some(u => 
  //       (u.userName && u.userName === user) ||
  //       (u.name && u.name === user)
  //     )
  //   );
  // },
  // deleteConversation: (id) => set((state) => ({
  //   conversetions: 
  //   state.conversetions.filter(conversation => conversation.id !== id)
  // })),
  // getConversationMessages: (id) => set((state) => ({ conversetions: state.conversetions.map((c) => c.id === id ? c.messages : c) })), // Function to get conversation messages

  // addConversation: (conversation) => set((state) => ({ conversetions: [...state.conversetions, conversation] })),
  // updateConversetion: (conversation) => set((state) => ({ conversetions: state.conversetions.map((c) => c.id === conversation.id ? conversation : c) })), // Function to update conversation data
  // addMessageToConversation: (id, message) => set((state) => ({ conversetions: state.conversetions.map((c) => c.id === id ? { ...c, messages: [...c.messages, message] } : c) })), // Function to add message to conversation

  sethasUnreadMessages: (flag) => set({ hasUnreadMessages: flag }),
  
  // clearConversations: () => set({
  //   conversations: [],
  //   hasUnreadMessages: false
  // }), 

}),{
name: 'ConversetionsStorage', // unique name for localStorage key
getStorage: () => localStorage // define localStorage as storage location
}))



export default useConversetionStore;