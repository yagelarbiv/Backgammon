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
  const addConversetion = useConversetionStore(
    (state) => state.addConversetion
  );
  const addMessageToConversation = useConversetionStore(
    (state) => state.addMessageToConversation
  );
  const [currentConversationId, setCurrentConversationId] = useState();

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  console.log(messages);
  useEffect(() => {
    const newSocket = io(chatUrl, { withCredentials: true });
    setSocket(newSocket);
    return () => newSocket && newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket || !user) return;

    setName(user.userName);
    socket.emit("set_name", user.userName);

    const messageHandler = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };
    const messageBroadcastHandler = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    socket.on("message", messageHandler);
    socket.on("message-broadcast", messageBroadcastHandler);

    // Cleanup the event listeners
    return () => {
      socket.off("message", messageHandler);
      socket.off("message-broadcast", messageBroadcastHandler);
    };
  }, [socket]);

  const currentConversation = useMemo(
    () => allConversations.find((c) => c.id === currentConversationId),
    [currentConversationId, allConversations]
  );

  const handleSendMessage = () => {
    addMessageToConversation(currentConversationId, { sender: name, text: currentMessage });
    setCurrentMessage("");
    if (socket && currentMessage.trim() !== "") {
      socket.emit("message", `${name}: ${currentMessage}`);
    }
  };
  const isConversationSelected = (conversation) => {
    return currentConversationId === conversation.id;
  };
  const onListClick = (selectedUser) => {
    let conversation = getConversationWithUser(selectedUser);
    console.log("conversation:", conversation);
    if (!conversation) {
      conversation = {
        id: uuiv4(),
        users: [user, selectedUser],
        messages: [],
      };
      addConversetion(conversation);
    }
    setCurrentConversationId(conversation.id);
    console.log(conversation.id);
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
          getConversationWithUser={getConversationWithUser}
          messages={currentConversation?.messages || []}
          currentMessage={currentMessage}
          CurrentConversationId={currentConversationId}
          allConversations={allConversations}
          setCurrentMessage={setCurrentMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </>
  );
}

export default ChatApp;
