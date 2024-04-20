
import useUserStore from '../../../storage/userStore';

function ChatHeader() {
    const user = useUserStore(state => state.user);
    console.log(user);
    return (
        <header className="chat-header">
            {user.userName}&apos;s Global chat
        </header>
    );
}

export default ChatHeader;
