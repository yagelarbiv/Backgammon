import axios from "axios";
import { useNavigate } from "react-router-dom";
const LogInOut = () => {
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    try {
      await axios.delete("https://localhost:6001/api/auth/logout", {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("User").RefreshToken
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
