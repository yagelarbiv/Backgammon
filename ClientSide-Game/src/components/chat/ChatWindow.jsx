import propTypes from 'prop-types';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatWindow({ messages, currentMessage, setCurrentMessage, handleSendMessage }) {
    return (
        <section className="chat-window">
            <ChatHeader />
            <MessageList messages={messages} />
            <MessageInput currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} />
        </section>
    );
}


export default ChatWindow;
