import propTypes from 'prop-types';
import ChatMessage from './ChatMessage';

function MessageList({ messages , currentConversation }) {

    const currentConversationMessages = currentConversation?.messages || [];

    return (
        <div className="message-list">
            {currentConversationMessages.map((msg, index) => (
                <ChatMessage key={msg.id} message={msg}   /> 
            ))}
        </div>
    );
}


export default MessageList;
