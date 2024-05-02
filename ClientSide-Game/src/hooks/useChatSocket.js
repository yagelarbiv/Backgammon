import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function useOnlineSocket() {
    const chatUrl = import.meta.env.VITE_APP_CHAT_URL;
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(chatUrl, { withCredentials: true });
        setSocket(newSocket);
    
        newSocket.on("connect", () => {
          console.log("connected with socket id: " + newSocket.id);
        });
        return () => newSocket && newSocket.close();
      }, []);
    
      useEffect(() => {
        if (!socket || !user) return;
    
        setName(user.userName);
        socket.emit("set_name", user.userName);
    
        const messageHandler = (message) => {
          addMessageToConversation(message.conversationId, message);
        }
        const messageBroadcastHandler = (msg) => {
          setMessages((prevMessages) => [...prevMessages, msg]);
        };
    
        socket.on('conversation_created', (newConversation) => {
          addConversation(newConversation);
        });
    
        socket.on("message", messageHandler);
        socket.on("message-broadcast", messageBroadcastHandler);
    
        return () => {
          socket.off("message", messageHandler);
          socket.off("message-broadcast", messageBroadcastHandler);
          socket.off('conversation_created');
    
        };
      }, [socket, currentConversationId, user, addMessageToConversation,addConversation]);
    

  const handleSendMessage = () => {
    if (socket && currentMessage.trim() !== "") {
      let recipientName = currentConversation.users.find(u => u.name !== user.name).name;
      if (recipientName === name) {
        currentConversation.users.map((u) => {
          if (u.userName !== recipientName && u.userName !== undefined) {
            recipientName = u.userName;
          }
      })}
      const messageData = {
        senderName: name,
        recipientName: recipientName,
        text: currentMessage,
        conversationId: currentConversationId,
      };
      socket.emit("message", messageData);
      setCurrentMessage("");
    }
  };

}