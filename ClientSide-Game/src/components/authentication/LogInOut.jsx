import axios from "axios";
import { useNavigate } from "react-router-dom";
const LogInOut = () => {
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    try {
      console.log(JSON.parse(localStorage.getItem("User")).AccessToken);
      await axios.delete("https://localhost:6001/api/auth/logout", {
        headers: {
          'Authorization': 'bearer ' + JSON.parse(localStorage.getItem("User")).AccessToken
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
