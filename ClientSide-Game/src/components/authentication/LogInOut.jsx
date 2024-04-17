import { LogOut } from "../../api/requests/auth";

const LogInOut = () => {
  return (
    <nav>
      <ul>
        <button
          onClick={LogOut}>
          Log Out
        </button>
      </ul>
    </nav>
  );
};

export default LogInOut;
