import { useState, useEffect } from "react";
import useUserStore from "../../stores/userStore";

function ChatHeader({ currentConversation }) {
  const { userName } = useUserStore((state) => state.user);
  const [secondUserName, setSecondUserName] = useState("");

  useEffect(() => {
    if (!currentConversation) return;
    if (currentConversation && currentConversation.members.length >= 2) {
      const otherUser = currentConversation.members.find(member =>
        member.toLowerCase() !== userName.toLowerCase()
      );
      setSecondUserName(otherUser || "Unknown user"); 
    } else {
      setSecondUserName(""); 
    }
  }, [currentConversation, userName]);

  return (
    <header className="chat-header">
      {userName && secondUserName ? (
        `${userName}'s conversation with ${secondUserName}`
      ) : (
        userName + "'s chat"
      )}
    </header>
  );
}

export default ChatHeader;