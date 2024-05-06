/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import ChatList from "../ItemList";
import ChatWindow from "./ChatWindow";
import useUserStore from "../../stores/userStore";
import useConversetionStore from "../../stores/conversetionStore";
import useAllUsersStore from "../../stores/allUsersStore";
import { unreadMessages } from "../../services/chatService";
import { notificationChatSound } from "../Notification";
import {
  getMessagesByConversation,
  fetchConversationsWithUser,
  addConversation,
  addMessageToConversation,
  deleteChat,
} from "../../services/apiService";

function ChatApp() {
  const chatUrl = import.meta.env.VITE_APP_CHAT_URL;
  const user = useUserStore((state) => state.user);

  const { hasUnreadMessages, sethasUnreadMessages } = useConversetionStore();
  const [ currentConversationId, setCurrentConversationId ] = useState();

  const [ messages, setMessages] = useState([]);
  const [ conversations, setConversations] = useState([]);
  const [ socket, setSocket] = useState(null);
  const [ name, setName] = useState("");
  const [ currentMessage, setCurrentMessage] = useState("");
  const allUsers = useAllUsersStore((state) => state.allUsers);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const allConversations = await fetchConversationsWithUser(user.userName);
        setConversations(allConversations);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        setConversations([]); 
      }
    };

    fetchConversations();
  }, [user.userName]);
  useEffect(() => {
    const newSocket = io(chatUrl, { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      // console.log("connected with socket id: " + newSocket.id);
    });
    return () => newSocket && newSocket.close();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentConversationId) {
        const messages = await getMessagesByConversation(currentConversationId);
        setMessages(messages);
      } else {
        setCurrentConversationId([]);
      }
    };
    fetchMessages();
  }, [currentConversationId]);


  useEffect(() => {
    if (!socket || !user) return;

    setName(user.userName);
    socket.emit("set_name", user.userName);

    const messageHandler = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("conversation_created", (newConversation) => {
      setConversations((prevConversations) => [
        ...prevConversations,
        newConversation,
      ]);
    });

    socket.on("message", messageHandler);

    return () => {
      socket.off("message", messageHandler);
      socket.off("conversation_created");
    };
  }, [
    socket,
    currentConversationId,
    user,
    addMessageToConversation,
    addConversation,
  ]);

  const handleSendMessage = () => {
    if (socket && currentMessage.trim() !== "") {
      const messageData = {
        senderName: user.userName,
        text: currentMessage,
        conversationId: currentConversationId,
      };
      socket.emit("message", messageData);
      setCurrentMessage("");
    }
  };

  const isConversationSelected = async (conversation) => {
    if (user) {
      try {
        const messages = await unreadMessages(user.userName);
        for (const message of messages) {
          if (
            messages.length === 0 ||
            messages === undefined ||
            messages === null
          ) {
            return currentConversationId === conversation._id;
          } else {
            notificationChatSound();
            await socket.emit("mark-message-as-read", message._id);
            if (message.conversationId === currentConversationId) {
              return currentConversationId === conversation._id;
            } else {
              sethasUnreadMessages(true);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
      return currentConversationId === conversation._id;
    }
  };

  const updateMessages = async (conversationId) => {
    const messages = await getMessagesByConversation(conversationId);
    setMessages(messages);
  };

  const onListClick = async (user) => {
    if (!user) return;
    console.log("conversations", conversations);
    const conversation = await addConversation([user.name,name]);
    console.log("conversation id", conversation._id);
    if (conversation) {
      setCurrentConversationId(conversation._id);
    }
  };
  return (
    <>
      <div className="chat-app">
        <aside className="sidebar">
          <ChatList
            sethasUnreadMessages={sethasUnreadMessages}
            hasUnreadMessages={hasUnreadMessages}
            type={"conversations"}
            items={conversations}
            isItemSelected={isConversationSelected}
            handleClick={(conversation) =>
              setCurrentConversationId(conversation._id)
            }
            list={allUsers}
            onListClick={onListClick}
            deleteChat={deleteChat}
          />
        </aside>
        <ChatWindow
          messages={messages || []}
          currentMessage={currentMessage}
          CurrentConversationId={currentConversationId}
          allConversations={conversations}
          addMessageToConversation={addMessageToConversation}
          setCurrentMessage={setCurrentMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </>
  );
}

export default ChatApp;
