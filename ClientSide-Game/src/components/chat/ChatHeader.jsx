import React, { useState, useEffect } from "react";
import useUserStore from "../../stores/userStore";

function ChatHeader({ allConversations, currentConversationId }) {
  const user = useUserStore((state) => state.user);
  const [secondUserName, setSecondUserName] = useState("");

  useEffect(() => {
    const currentConversation = allConversations.find(conversation => conversation.id === currentConversationId);

    if (currentConversation) {
      // Identify the other user by excluding the logged-in user's userName
      const otherUser = currentConversation.users.find(u => {
        // Normalize the userName to ensure we compare the same type of attribute
        const normalizedCurrentUserName = user.userName.toLowerCase();
        const otherUserName = (u.userName || u.name).toLowerCase();
        return otherUserName !== normalizedCurrentUserName;
      });

      if (otherUser) {
        // Extract the name in a way that handles missing properties
        const nameToDisplay = otherUser.userName || otherUser.name;
        setSecondUserName(nameToDisplay);
      } else {
        // Reset or provide alternative text if no other user is found
        setSecondUserName("No other user found");
      }
    }
  }, [allConversations, currentConversationId, user.userName]);

  return (
    <header className="chat-header">
      {/* {user.userName && secondUserName ? (
        `${user.userName}'s conversation with ${secondUserName}`
      ) : (
        'Loading conversation...' // Provide a fallback or loading state
      )} */}
      {user.userName}'s 
    </header>
  );
}

export default ChatHeader;
