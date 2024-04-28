
function MessageInput({ currentMessage, setCurrentMessage, handleSendMessage  }) {

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && currentMessage.trim() !== '') {
            handleSendMessage();
        }
    };
    return (
        <div className="message-input">
            <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Write a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}

export default MessageInput;