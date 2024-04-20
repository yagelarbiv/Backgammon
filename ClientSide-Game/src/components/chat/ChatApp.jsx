import { useState, useEffect } from 'react';
import io from "socket.io-client";
import './ChatApp.css';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import useUserStore from '../../../storage/userStore';

function ChatApp() {
    const chatUrl = import.meta.env.VITE_APP_CHAT_URL;
    const user = useUserStore(state => state.user);
    
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [name, setName] = useState("");
    const [currentMessage, setCurrentMessage] = useState("");
    
    
    useEffect(() => {
        const newSocket = io(chatUrl, { withCredentials: true });
        setSocket(newSocket);
        return () => newSocket && newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;

        setName(user.userName)
        socket.emit("set_name", user.userName)
        
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
        if (socket && name) {
            socket.emit("message", `${name}: ${currentMessage}`);
            setCurrentMessage("");
        } else {
            alert("Please enter your name before sending a message!");
        }
    };
    const handleDisconnect = () => {        // this function does not work.
        const newMessage = {
            sender: name, // This should be replaced with the current user's name
            content: currentMessage,
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
    const handleSetName = () => {
        if (socket && name) {
            socket.emit("set_name", name);
        } else {
            alert("Please enter your name before setting it!");
        }
    };
    return (
        <>

            <div className="chat-app">
                <aside className="sidebar">
                    <ChatList messages={messages} currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} />
                </aside>
                <ChatWindow messages={messages} currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} />
            </div>

            <button onClick={handleDisconnect}>Disconnect</button>
            <div>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                />
                <button onClick={handleSetName}>Set Name</button>
            </div>
        </>
    );
}
    
export default ChatApp;
