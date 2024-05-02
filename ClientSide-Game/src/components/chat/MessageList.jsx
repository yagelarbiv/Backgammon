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
            {currentConversationMessages.map((msg, index) => (
                <ChatMessage 
                key={msg.id}
                message={msg} 
                isLastMessage={index === currentConversationMessages.length - 1}
                user1 = {currentConversation.users[1].name}
                user2 = {currentConversation.users[0].userName}
                /> 
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}


export default MessageList;