import useUserStore from "../../stores/userStore";
import useConversetionStore from "../../stores/conversetionStore";
//import {unreadMessages} from "../../services/chatService";
function ChatMessage({ message,isLastMessage }) {
    const { hasUnreadMessages } = useConversetionStore();


    const user = useUserStore(state => state.user);
    const name = message.senderName;
    const content = message.text;
    const date = new Date(); 
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;


    return (
        <>
        <div className={`message ${name === user.userName ? "sender" : "recipient"}`}>
            <div className="message-info">
                <span className="message-sender">{name}</span>
                <span className="message-timestamp">{formattedDate}</span>
            </div>
            <div className="message-content">{content}</div>
        </div>
        { isLastMessage && hasUnreadMessages === false && <span>Message Read</span>  }

        </>
    );
}

export default ChatMessage;