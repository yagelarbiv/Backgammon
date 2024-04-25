import propTypes from 'prop-types';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatWindow({addMessageToConversation,allConversations ,CurrentConversationId, messages, currentMessage, setCurrentMessage, handleSendMessage }) {
    return (
        <section className="chat-window">
            <ChatHeader allConversations={allConversations} CurrentConversationId={CurrentConversationId}/>
            <MessageList messages={messages} allConversations={allConversations} CurrentConversationId={CurrentConversationId} />
            <MessageInput addMessageToConversation={addMessageToConversation} currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} />
        </section>
    );
}


export default ChatWindow;
