import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

function NavBar() {
    const navigate = useNavigate();
    const user = useUserStore(state => state.user);
    const [isOpen, setIsOpen] = useState(false);

    const handleNavigation = (path) => {
        setIsOpen(false);  
        navigate(path);
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbar">
                    <div className="navbar-nav">
                        {user ? (
                            <>
                                <a className="nav-item nav-link" onClick={() => handleNavigation("/")}>Home</a>
                                <a className="nav-item nav-link" onClick={() => handleNavigation("/logout")}>Logout</a>
                                <a className="nav-item nav-link" onClick={() => handleNavigation("/chat")}>Chat</a>
                                <a className="nav-item nav-link" onClick={() => handleNavigation("/game")}>Game</a>
                            </>
                        ) : (
                            <>
                                <a className="nav-item nav-link" onClick={() => handleNavigation("/login")}>Login</a>
                                <a className="nav-item nav-link" onClick={() => handleNavigation("/register")}>Sign Up</a>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default NavBar;
