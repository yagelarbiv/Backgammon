import axios from "axios";
const AXIOS_TIMEOUT_MS = 5000;

const baseURL = "http://localhost:3003/api/game";

const axiosInstance = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Do something with response data
    console.log('Intercepted Response:', response);
    return response;
  },
  function (error) {
    // Do something with response error
    console.log('Intercepted Response Error:', error);
    return Promise.reject(error);
  }
);

interface Response {
  success: boolean;
}

export async function joinGame(
  username: string,
  opponent: string,
  socketId: string | undefined
): Promise<boolean> {
  try {
    if (socketId === undefined) return false;
    const body = {
      username,
      opponent,
      socketId,
    };
    const response = await axiosInstance.post("/join-game", body);
    if (response.status !== 200) throw new Error("Failed to join game");
    // No need to check if response is falsy as Axios would throw an error if the request failed
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function requestEndGame(
  username: string,
  opponent: string,
  isWin: boolean,
  points: number
): Promise<void> {
  try {
    const body = {
      username,
      opponent,
      isWin,
      points,
    };
    const response = await axiosInstance.post("/end-game", body);
    if (response.status !== 200) {
      throw new Error("Failed to end game");
    }
    // If the response is successful, there is no need to return anything
  } catch (err) {
    console.error(err);
    // If you want to handle the error outside, you could also throw the error
    // throw err;
  }
}

export async function requestStartGame(
  username: string,
  opponent: string,
  gameObjectJson: string
): Promise<void> {
  try {
    const body = {
      username,
      opponent,
      gameObject: gameObjectJson,
    };
    const response = await axiosInstance.post("/start-game", body);
    if (response.status !== 200) {
      throw new Error("Failed to start game");
    }
    // If the response is successful, there is no need to return anything
  } catch (err) {
    console.error(err);
    // If you want to handle the error outside, you could also throw the error
    // throw err;
  }
}

export async function notifyChangeTurn(
  username: string,
  opponent: string,
  message: string
): Promise<void> {
  try {
    const response = await axiosInstance.post("/notify-change-turn", {
      username,
      opponent,
      message,
    });
    if (response.status !== 200) {
      throw new Error("Failed to notify change of turn");
    }
    // If the response is successful, there is no need to return anything
  } catch (err) {
    console.error(err);
    // Handle the error as needed
  }
}

export async function requestUserSelect(
  username: string,
  opponent: string,
  json: string
): Promise<boolean | undefined> {
  try {
    const response = await axiosInstance.post("/select", {
      username,
      opponent,
      json,
    });
    console.log(response);
    if (response.status !== 200) throw new Error("Failed to send select event");
    console.log(response.data);
    return true;
  } catch (err) {
    console.error(err);
    if (axios.isCancel(err)) {
      console.error("SELECT REQUEST TIMED OUT: ", err);
    }
    return false;
  }
}

export async function requestRollDice(username: string, opponent: string, turnJson: string) {
  try {
    const response = await axiosInstance.post('/roll-dice', { turnJson, username, opponent });
    console.log("response from roll-dice", response.data);
    if (response.status !== 200) {
      throw new Error("Failed to roll dice");
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const getStartingPlayer = async (username: string, opponent: string): Promise<any> => {
  try {
    // Prepare the data for the post request
    const params = { username, opponent };
    const data = {
      users: [username, opponent],
    };

    // Make the post request with the axios instance
    const response = await axiosInstance.post("/get-first-player", data, { params });

    console.log(response);
    if (response.status !== 200) {
      throw new Error("Failed to get starting player");
    }
    return response.data.result;
  } catch (err) {
    console.error(err);
    // It's usually a good idea to throw the error or handle it so that the calling function is aware
    throw err;
  }
};
