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
import { updateConversation } from "../../utils/UpdateConversation";

function ChatApp() {
  const chatUrl = import.meta.env.VITE_APP_CHAT_URL;
  const user = useUserStore((state) => state.user);

  const { hasUnreadMessages, sethasUnreadMessages } = useConversetionStore();
  const [ currentConversationId, setCurrentConversationId ] = useState();
  const [ currentConversation, setCurrentConversation ] = useState();
  const [ messages, setMessages] = useState([]);
  const [ conversations, setConversations] = useState([]);
  const [ socket, setSocket] = useState(null);
  const [ name, setName] = useState("");
  const [ currentMessage, setCurrentMessage] = useState("");
  const allUsers = useAllUsersStore((state) => state.allUsers);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user ) return;
      try {
        const allConversations = await fetchConversationsWithUser(user.userName);
        setConversations(allConversations);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        setConversations([]); 
      }
    };

    fetchConversations();
  }, [name, currentConversation]);

  useEffect(() => {
    const findCurrentConversation = async () => {
      if (currentConversationId) {
        conversations.map((conversation) => {
          if (conversation._id === currentConversationId) {
            setCurrentConversation(conversation);
          }
        });
      }
    }

    findCurrentConversation();
  }, [currentConversationId]);
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
        console.log("fetch messages", messages);
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

    const messageHandler = async (message) => {
      console.log("received message in messege handelr", message);

      if (message.conversationId !== currentConversationId) return

      setMessages((prevMessages) =>  [...prevMessages, message]);
      // await addMessageToConversation(message.conversationId, message.text, message.senderName,message.senderName)     
      // .then(() => setCurrentMessage(""))
      // .catch(error => console.error('Error sending message:', error));
    };

    const deleteConversationHandler = async (conversationId) => {
      updateConversation('delete', { conversationId }, setConversations);
    }

    const addConversationHandler = (newConversation) => {
      updateConversation('add', newConversation, setConversations);
    }

    socket.on('delete-conversation', deleteConversationHandler);
    socket.on("add-conversation", addConversationHandler);

    socket.on("conversation_created", (newConversation) => {
      setConversations((prevConversations) => [
        ...prevConversations,
        newConversation,
      ]);
    });

    socket.on("message", messageHandler);

    return () => {
      socket.off("delete-conversation", deleteConversationHandler);
      socket.off("add-conversation", addConversationHandler);
      socket.off("message", messageHandler);
      socket.off("conversation_created");
    };
  }, [
    socket,
    currentConversationId,
    user,
    addMessageToConversation,
    addConversation,
    setConversations,

  ]);

const handleSendMessage = async () => {
  if (!socket || currentMessage.trim() === "") return;

  const messageData = {
    senderName: user.userName,
    recipientName: currentConversation.members.find(m => m !== user.userName),
    text: currentMessage,
    conversationId: currentConversationId,
  };
  
  socket.emit("message", messageData);
  setCurrentMessage("")
};

  const isConversationSelected = async (conversation) => {
    if (user && currentConversationId) {
      try {
        const messages = await unreadMessages(name);
        for (const message of messages) {
          if (
            messages.length === 0 ||
            messages === undefined ||
            messages === null
          ) {
            return currentConversationId === conversation._id;
          } else { 
            //Here sound effect
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

    const conversation = await addConversation([user.name,name]);
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
            setConversations={setConversations}
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
          currentConversation={currentConversation}
        />
      </div>
    </>
  );
}

export default ChatApp;
