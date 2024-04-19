import propTypes from 'prop-types';
import ChatMessage from './ChatMessage';

function MessageList({ messages }) {

    return (
        <div className="message-list">
            {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
            ))}
        </div>
    );
}

MessageList.propTypes = {
    messages: propTypes.array.isRequired

}

export default MessageList;
