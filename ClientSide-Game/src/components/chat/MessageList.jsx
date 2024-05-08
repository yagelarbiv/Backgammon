import ChatMessage from './ChatMessage';
import { useRef, useEffect} from 'react';

function MessageList({ messages,currentConversation }) {
    const messagesEndRef = useRef(null);


    useEffect(() => {
        if (!currentConversation) return;
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages,currentConversation]);


    return (
        <div className="message-list">
            {messages.map((msg, index) => (
                <ChatMessage 
                key={index}
                message={msg} 
                isLastMessage={index === messages.length - 1}
                /> 
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}


export default MessageList;