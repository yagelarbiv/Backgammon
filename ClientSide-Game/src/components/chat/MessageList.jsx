import ChatMessage from './ChatMessage';
import { useRef, useEffect} from 'react';

function MessageList({ messages, allConversations }) {
    const messagesEndRef = useRef(null);

    const currentConversationMessages = messages || [];
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    console.log("messsages", messages)
    console.log("currentConversationMessages", currentConversationMessages);
    return (
        <div className="message-list">
            {currentConversationMessages.map((msg, index) => (
                <ChatMessage 
                key={msg.id}
                message={msg} 
                isLastMessage={index === currentConversationMessages.length - 1}
                /> 
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}


export default MessageList;