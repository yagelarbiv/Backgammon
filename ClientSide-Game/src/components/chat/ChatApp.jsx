import { useState, useEffect } from 'react';
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
<<<<<<< HEAD


=======
    
>>>>>>> b868975a51bdb5ccda79e6735f0e8e7d1e92e74c
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
<<<<<<< HEAD

        setName(user)
        socket.emit("set_name", user.userName)

=======
        
>>>>>>> b868975a51bdb5ccda79e6735f0e8e7d1e92e74c
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
<<<<<<< HEAD
            socket.emit("message", `${name}: ${currentMessage}`);
            setCurrentMessage("");
=======
          socket.emit("message", `${user.userName}: ${currentMessage}`);
          setCurrentMessage("");
>>>>>>> b868975a51bdb5ccda79e6735f0e8e7d1e92e74c
        } else {
            alert("Please enter content before sending a message!");
        }
    };

    const handleDisconnect = () => {                                                       
        const newMessage = {
<<<<<<< HEAD
            sender: name, // This should be replaced with the current user's name
            content: currentMessage,
=======
            sender: user.username,
            content: message,
>>>>>>> b868975a51bdb5ccda79e6735f0e8e7d1e92e74c
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
<<<<<<< HEAD

            <div className="chat-app">
                <aside className="sidebar">
                    <ChatList AllUsers={Allusers} currentChatId={currentChatId} setCurrentChatId={setCurrentChatId} />
                </aside>
                <ChatWindow messages={messages} currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} />
            </div>
            <button onClick={handleDisconnect}>Disconnect</button>
=======
        
        <div className="chat-app">
            <aside className="sidebar">
                <ChatList currentChatId={currentChatId} setCurrentChatId={setCurrentChatId} user={user}/>   
            </aside>
            <ChatWindow messages={messages} currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} user={user} />
        </div>
        <button onClick={handleDisconnect}>Disconnect</button>
>>>>>>> b868975a51bdb5ccda79e6735f0e8e7d1e92e74c
        </>
    );
}

export default ChatApp;
