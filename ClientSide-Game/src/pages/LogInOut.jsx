import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import useAuthStore from "../stores/authStore";


const LogInOut = () => {
  const authUrl = import.meta.env.VITE_APP_AUTH_URL;
  const clearUser = useUserStore(state => state.clearUser);
  const accessToken = useAuthStore(state => state.accessToken);
  const clearData  = useAuthStore(state => state.clearData);
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    console.log(accessToken);
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      await axios.post(authUrl + "/logout", {
        withCredentials: true,
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
