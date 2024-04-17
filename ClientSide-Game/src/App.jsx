import React from "react";
import "./App.css";
import ChatApp from "./components/chat/ChatApp";
import NavBar from "./components/Game/NavBar";
import GameBoard from "./components/Game/GameBoard";

function App() {
  return(
  <>
    
    {/* <div className="App">
      <AuthPage/>
    </div> */}
    <NavBar/>
     <GameBoard/> 
     <ChatApp/>
  </>
  )
}

export default App;