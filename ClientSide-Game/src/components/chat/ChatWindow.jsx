import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';


function ChatWindow({currentConversation, messages, currentMessage, setCurrentMessage, handleSendMessage,allConversations }) {
    return (
        <section className="chat-window">
            <ChatHeader currentConversation={currentConversation}/>
            <MessageList messages={messages} currentConversation={currentConversation} allConversations={allConversations} />
            <MessageInput currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} />
        </section>
    );
}


export default ChatWindow;
