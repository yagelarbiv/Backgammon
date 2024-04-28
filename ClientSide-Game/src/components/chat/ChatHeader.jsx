import { useState, useEffect } from "react";
import useUserStore from "../../stores/userStore";

function ChatHeader({ currentConversation }) {
  const { userName } = useUserStore((state) => state.user);
  const [secondUserName, setSecondUserName] = useState("");

  useEffect(() => {
    if (!currentConversation) {
      return;
    }
    
    const normalizedCurrentUserName = userName.toLowerCase();
    const otherUser = currentConversation.users.find(u => {
      const otherUserName = (u.userName || u.name)?.toLowerCase();
      return otherUserName !== normalizedCurrentUserName;
    });

    if (otherUser) {
      setSecondUserName(otherUser.userName || otherUser.name);
    } else {
      setSecondUserName(userName+"'s chat");
    }
  }, [currentConversation, userName]);

  return (
    <header className="chat-header">
      {userName && secondUserName ? (
        `${userName}'s conversation with ${secondUserName}`
      ) : (
        userName+"'s chat"
      )}
    </header>
  );
}

export default ChatHeader;