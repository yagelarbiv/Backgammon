import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";


const LogInOut = () => {
  const authUrl = import.meta.env.VITE_APP_AUTH_URL;
  const user = useUserStore(state => state.user);
  const auth = useUserStore(state => state.auth);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    
    console.log("user refreshed token: " + auth.refreshedToken);
    try {
      await axios.post(authUrl+"/logout", {
        headers: {
          'Authorization': 'Bearer ' + user.refreshedToken  
        }
      })
      .then(function (response) {
        console.log(response);
        localStorage.removeItem("User");
        navigate("/")
      })
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <nav>
      <ul>
        <button
          onClick={submit}>
          Log Out
        </button>
      </ul>
    </nav>
  );
};

export default LogInOut;
