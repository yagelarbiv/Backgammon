import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import useAuthStore from "../stores/authStore";
import { logOut, refreshAccessToken } from "../api/requests/auth";

const LogInOut = () => {
  const clearUser = useUserStore(state => state.clearUser);
  const clearData = useAuthStore(state => state.clearData);
  const accessToken = useAuthStore(state => state.accessToken);
  const refreshToken = useAuthStore(state => state.refreshToken);
  const setAccessToken = useAuthStore(state => state.setAccessToken);
  const setRefreshToken = useAuthStore(state => state.setRefreshToken);
  const navigate = useNavigate();
async function submit(e) {
    e.preventDefault();
    const response = await logOut(accessToken);
    if (response.status === 401) {
      const tokens = await refreshAccessToken(refreshToken);
      setAccessToken(tokens[0]);
      setRefreshToken(tokens[1]);
      logOut(accessToken);
    }
    clearData();
    clearUser();
    navigate("/");
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
