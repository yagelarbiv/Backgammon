import propTypes from 'prop-types';
import ChatMessage from './ChatMessage';

function MessageList({ messages , allConversations, CurrentConversationId }) {

    const currentConversation = allConversations.find(conversation => conversation.id === CurrentConversationId);
    console.log( " currentConversetion: ",currentConversation);
    const currentConversationMessages = currentConversation?.messages || [];
    return (
        <div className="message-list">
            {currentConversationMessages.map((msg, index) => (
                <ChatMessage key={index} message={msg} currentConversation={currentConversation}  />
            ))}
        </div>
    );
}


export default MessageList;
