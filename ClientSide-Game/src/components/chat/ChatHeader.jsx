/* eslint-disable react/no-unescaped-entities */
import useUserStore from "../../stores/userStore";

function ChatHeader() {
  const user = useUserStore((state) => state.user);
  if (!user) {
    return null;
  }
  return <header className="chat-header">{user.userName}'s Global chat</header>;
}

export default ChatHeader;
