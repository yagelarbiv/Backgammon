import ChatMessage from './ChatMessage';
import { useRef, useEffect} from 'react';

function MessageList({ messages , currentConversation }) {
    const messagesEndRef = useRef(null);
    const currentConversationMessages = currentConversation?.messages || [];
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="message-list">
            {currentConversationMessages.map((msg) => (
                <ChatMessage key={msg.id} message={msg}   /> 
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}


export default MessageList;