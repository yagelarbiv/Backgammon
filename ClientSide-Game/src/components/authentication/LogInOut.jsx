import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../../storage/userStore";


const LogInOut = () => {
  const authUrl = import.meta.env.VITE_APP_AUTH_URL;
  const user = useUserStore(state => state.user);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post(authUrl+"/logout", {
        headers: {
          'Authorization': 'Bearer ' + user.refreshedToken  //localStorage.getItem("User").RefreshToken
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
