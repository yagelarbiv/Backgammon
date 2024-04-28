/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import ChatList from "../ItemList";
import ChatWindow from "./ChatWindow";
import useUserStore from "../../stores/userStore";
import useConversetionStore from "../../stores/conversetionStore";
import useAllUsersStore from "../../stores/allUsersStore";
import { v4 as uuiv4 } from "uuid";

function ChatApp() {
  const chatUrl = import.meta.env.VITE_APP_CHAT_URL;
  
  const user = useUserStore((state) => state.user);
  const allUsers = useAllUsersStore((state) => state.allUsers);
  const allConversations = useConversetionStore((state) => state.conversetions);
  const getConversationWithUser = useConversetionStore(
    (state) => state.getConversationWithUser
  );
  const addConversation = useConversetionStore(
    (state) => state.addConversation
  );
  const addMessageToConversation = useConversetionStore(
    (state) => state.addMessageToConversation
  );

  const [currentConversationId, setCurrentConversationId] = useState();

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    const newSocket = io(chatUrl, { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("connected with socket id: " + newSocket.id);
    });
    return () => newSocket && newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket || !user) return;

    setName(user.userName);
    socket.emit("set_name", user.userName);

    const messageHandler = (message) => {
      if (message.conversationId === currentConversationId) {
        // Add message to conversation
        addMessageToConversation(currentConversationId, message);
      }
    };
    const messageBroadcastHandler = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    socket.on('conversation_created', (newConversation) => {
      addConversation(newConversation);
    });

    socket.on("message", messageHandler);
    socket.on("message-broadcast", messageBroadcastHandler);

    return () => {
      socket.off("message", messageHandler);
      socket.off("message-broadcast", messageBroadcastHandler);
      socket.off('conversation_created');

    };
  }, [socket, currentConversationId, user, addMessageToConversation,addConversation]);

  const currentConversation = useMemo(
    () => allConversations.find((c) => c.id === currentConversationId),
    [currentConversationId, allConversations]
  );

  const handleSendMessage = () => {
    //addMessageToConversation(currentConversationId, { sender: name, text: currentMessage });

    if (socket && currentMessage.trim() !== "") {
      let recipientName = currentConversation.users.find(u => u.name !== user.name).name;
      if (recipientName === name) {
        currentConversation.users.map((u) => {
          if (u.userName !== recipientName && u.userName !== undefined) {
            recipientName = u.userName;
          }
      })}
      const messageData = {
        senderName: name,
        recipientName: recipientName,
        text: currentMessage,
        conversationId: currentConversationId,
      };
      socket.emit("message", messageData);
      setCurrentMessage("");
    }
  };

  const isConversationSelected = (conversation) => {
    return currentConversationId === conversation.id;
  };

const onListClick = (selectedUser) => {
  let conversation = getConversationWithUser(selectedUser.name);

  if (!conversation) {
    conversation = {
      id: uuiv4(),
      users: [user, selectedUser],
      messages: [],
    };
  
    addConversation(conversation);
    setCurrentConversationId(conversation.id);
  
    socket.emit('new_conversation', { conversation, otherUserId: selectedUser.name });

  } else {
    setCurrentConversationId(conversation.id);
    console.log(conversation);
  }
};
  return (
    <>
      <div className="chat-app">
        <aside className="sidebar">
          <ChatList
            type={"conversations"}
            items={allConversations}
            isItemSelected={isConversationSelected}
            handleClick={(conversation) =>
              setCurrentConversationId(conversation.id)
            }
            list={allUsers}
            onListClick={onListClick}
          />
        </aside>
        <ChatWindow
          messages={currentConversation?.messages || []}
          currentMessage={currentMessage}
          CurrentConversationId={currentConversationId}
          allConversations={allConversations}
          addMessageToConversation={addMessageToConversation}
          setCurrentMessage={setCurrentMessage}
          handleSendMessage={handleSendMessage}
          currentConversation={currentConversation}
        />
      </div>
    </>
  );
}

export default ChatApp;
