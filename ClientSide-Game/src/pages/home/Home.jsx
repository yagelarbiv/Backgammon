import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatList from "../../components/ItemList";
import "./Home.css";
import { io } from "socket.io-client";
import useAllUsersStore from "../../stores/allUsersStore";
import useAuthStore from "../../stores/authStore";
import useUserStore from "../../stores/userStore";

function Home() {
  const navigate = useNavigate();
  const allUsers = useAllUsersStore((state) => state.allUsers);
  const setAllUsers = useAllUsersStore((state) => state.setAllUsers);
  const [socket, setSocket] = useState(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [currentUsername, setCurrentUsername] = useState();
  const user = useUserStore((state) => state.user);
console.log(socket);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const newSocket = io("http://localhost:5777", {
      withCredentials: true,
      auth: { token: accessToken },
    });

    setSocket(newSocket);

    newSocket.on("allUsers", (users) => {
      console.log("Received users from socket:", users);
      setAllUsers(users);
    });

    return () => {
      newSocket.off("allUsers");
      newSocket.close();
    };
  }, [accessToken, setAllUsers]);

  const isUserSelected = (user) => {
    return currentUsername === user.name;
  };

  return (
    <>
      <div className="home-page">
        <h1 className="title-home">Welcome to Backgammon</h1>
        <aside className="sidebar">
          <ChatList
            type={"users"}
            items={allUsers}
            isItemSelected={isUserSelected}
            handleClick={(user) => setCurrentUsername(user.name)}
          />
        </aside>
        <div className="button-container">
          <button className="start-game" onClick={() => navigate("/game")}>
            Start Game
          </button>
          <button className="join-chat" onClick={() => navigate("/chat")}>
            Join Chat
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
