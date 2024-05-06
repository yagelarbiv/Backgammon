import { useNavigate } from 'react-router-dom'
import useUserStore from '../stores/userStore';
function NavBar() {
  const navigate = useNavigate();
  const user = useUserStore(state => state.user)
  return (
    <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
      crossOrigin="anonymous"
    />
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
      crossOrigin="anonymous"
    />
        <script
      src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
      integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
      crossOrigin="anonymous"
    ></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
      integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
      crossOrigin="anonymous"
    ></script>
    <script
      src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
      integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
      crossOrigin="anonymous"
    ></script>
    <script
    src="https://cdn.socket.io/4.6.0/socket.io.min.js"
    integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI"
      crossOrigin="anonymous">
    </script>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbar"
            >
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbar">
            <div className="navbar-nav">
              {
                user ? (
                  <>
                    <a className="nav-item nav-link" id="home" onClick={() => navigate("/")}>Home</a>
                    <a className="nav-item nav-link" id="logout" onClick={() => navigate("/logout")}>Logout</a>
                    <a className="nav-item nav-link" id="chat" onClick={() => navigate("/chat")}>chat</a>
                    <a className="nav-item nav-link" id="game" onClick={() => navigate("/game")}>game</a>
                  </>
                ) : (
                  <>
                    <a className="nav-item nav-link" id="login" onClick={() => navigate("/login")}>Login</a>
                    <a className="nav-item nav-link" id="signUp" onClick={() => navigate("/register")}>Sign Up</a>
                  </>
                )
              }
            </div>
            </div>
        </nav>
    
    </>
  
  )
}

export default NavBar
