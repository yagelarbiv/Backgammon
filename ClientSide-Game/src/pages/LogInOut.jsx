import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import useAuthStore from "../stores/authStore";
import { refreshAccessToken } from '../utils/Tokens';
import useConversationStore from "../stores/conversetionStore";

const LogInOut = () => {
  const authUrl = import.meta.env.VITE_APP_AUTH_URL;
  const clearUser = useUserStore(state => state.clearUser);
  const accessToken = useAuthStore(state => state.accessToken);
  const refreshToken = useAuthStore(state => state.refreshToken);
  const clearData = useAuthStore(state => state.clearData);
  const clearConversations = useConversationStore(state => state.clearConversations);
  const navigate = useNavigate();

  axios.interceptors.response.use(function () {
      async (response) => {
        if (response.status === 401) {
          const Tokens = await refreshAccessToken(refreshToken);
          console.log(Tokens);
          if (Tokens) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${Tokens[0]}`
          }
        }
      }
    async (error) => {
      if (error.response.status === 401) {
        const Tokens = await refreshAccessToken(refreshToken);
        if (Tokens) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${Tokens[0]}`
        }
      }
    }
  });
  async function submit(e) {
    e.preventDefault();
    console.log(authUrl);
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      await axios.post(`${authUrl}/logout`, {
        withCredentials: true,
      })
        .then(function (response) {
          console.log(response);
          clearUser();
          clearData();
          clearConversations();
          navigate("/login")
        })
    } catch (err) {
      console.log(err.response.status);
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
