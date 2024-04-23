/* eslint-disable react/prop-types */

import useUserStore from "../../stores/userStore";

function ChatMessage({ message }) {
    const name = message.split(':')[0]
    const content = message.split(':')[1]
    const timestamp = Date.now()
    const date = new Date(timestamp)
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    const user = useUserStore(state => state.user);
    
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
