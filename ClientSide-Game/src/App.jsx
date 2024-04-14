import React from "react";
import "./App.css";
import ChatApp from "./components/chat/ChatApp";
import NavBar from "./components/Game/NavBar";


function App() {
  return(
  <>
    
    {/* <div className="App">
      <AuthPage/>
    </div> */}
    <NavBar/>
     <ChatApp/>
  </>
  )
}

export default App;