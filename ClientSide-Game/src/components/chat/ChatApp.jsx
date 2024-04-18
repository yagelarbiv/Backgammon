import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import './ChatApp.css';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import useUserStore from '../../../storage/userStore';


function ChatApp() {
    const chatUrl = import.meta.env.VITE_APP_CHAT_URL;
    const { user } = useUserStore(); 

    const [currentChatId, setCurrentChatId] = useState(null)
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [currentMessage, setCurrentMessage] = useState("");
    
    useEffect(() => {
        const newSocket = io(chatUrl, { withCredentials: true });
        setSocket(newSocket);
        const OnlineSocket = io(import.meta.env.VITE_APP_ONLINE_URL)
        setSocket(OnlineSocket);

        OnlineSocket.on('connect', () => {
            OnlineSocket.emit('online', user.username);
        })
        
        return () => newSocket && newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;
        
        const messageHandler = (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        };
        const messageBroadcastHandler = (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        };
      
        socket.on("message", messageHandler);
        socket.on("message-broadcast", messageBroadcastHandler);

        // Cleanup the event listeners
        return () => {
        socket.off("message", messageHandler);
        socket.off("message-broadcast", messageBroadcastHandler);
      };
    }, [socket]);
            
    const handleSendMessage = () => {
        if (socket && currentMessage.trim() !== '') {
          socket.emit("message", `${user.userName}: ${currentMessage}`);
          setCurrentMessage("");
        } else {
          alert("Please enter content before sending a message!");
        }
    };

    const handleDisconnect = () => {                                                       
        const newMessage = {
            sender: user.username,
            content: message,
            timestamp: new Date().toLocaleString()
        };
        setMessages([...messages, newMessage]);
        setCurrentMessage(newMessage);
        if (socket) {
          socket.emit("manual_disconnect");
          socket.disconnect();
          alert("Disconnected from server");
        }
    };

    return (
        <>
        
        <div className="chat-app">
            <aside className="sidebar">
                <ChatList currentChatId={currentChatId} setCurrentChatId={setCurrentChatId} user={user}/>   
            </aside>
            <ChatWindow messages={messages} currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} user={user} />
        </div>
        <button onClick={handleDisconnect}>Disconnect</button>
        </>
    );
}

export default ChatApp;
