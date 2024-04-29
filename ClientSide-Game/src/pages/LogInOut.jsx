import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import useAuthStore from "../stores/authStore";


const LogInOut = () => {
  const authUrl = import.meta.env.VITE_APP_AUTH_URL;
  const user = useUserStore(state => state.user);
  const clearUser = useUserStore(state => state.clearUser);
  const accessToken = useAuthStore(state => state.accessToken);
  const clearData  = useAuthStore(state => state.clearData);
  const navigate = useNavigate();
console.log(accessToken);
  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post(authUrl+"/logout", {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      })
      .then(function (response) {
        console.log(response);
        clearUser();
        clearData();
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
