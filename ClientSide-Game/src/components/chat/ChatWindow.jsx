import propTypes from 'prop-types';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatWindow({ name ,messages, currentMessage, setCurrentMessage, handleSendMessage }) {
    return (
        <section className="chat-window">
            <ChatHeader name={name}/>
            <MessageList messages={messages} />
            <MessageInput currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} />
        </section>
    );
}
ChatWindow.propTypes = {
    name: propTypes.string.isRequired,
    messages: propTypes.array.isRequired,
    currentMessage: propTypes.string.isRequired,
    setCurrentMessage: propTypes.func.isRequired,
    handleSendMessage: propTypes.func.isRequired
}

export default ChatWindow;
