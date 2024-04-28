import useUserStore from "../../stores/userStore";

function ChatMessage({ message }) {
    const user = useUserStore(state => state.user);
    const name = message.senderName;
    const content = message.text;
    const date = new Date(); 
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;


    return (
        <div className={`message ${name === user.userName ? "sender" : "recipient"}`}>
            <div className="message-info">
                <span className="message-sender">{name}</span>
                <span className="message-timestamp">{formattedDate}</span>
            </div>
            <div className="message-content">{content}</div>
        </div>
    );
}

export default ChatMessage;