import axios from 'axios';


const API_BASE_URL ='http://localhost:5000/api';  // import.meta.env.VITE_APP_CHAT_URL; 



export const fetchAllMessages = async (receiverName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all-messages`, { params: { receiverName } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
};

export const deleteChat = async (conversationId) => {
  try {
    await axios.delete(`${API_BASE_URL}/delete-chat`, { params: { conversationId } });
  } catch (error) {
    console.error('Failed to delete conversation:', error);
  }
};

export const fetchConversationsWithUser = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-conversations-with-user/${username}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return [];
  }
};

export const addConversation = async (users) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/add-conversation`, { users });
      return response.data;  
    } catch (error) {
      console.error('Failed to add conversation:', error);
      return null;  
    }
  };

export const addMessageToConversation = async (conversationId, message, senderName, receiverName) => {
  try {
    await axios.post(`${API_BASE_URL}/add-message-to-conversation`, { 
      params: { conversationId, message, senderName, receiverName } 
    });
  } catch (error) {
    console.error('Failed to add message:', error);
  }
};

export const getMessagesByConversation = async (conversationId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/messages/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
}

