import axios from "axios";
const AXIOS_TIMEOUT_MS = 5000;

const baseURL = "http://localhost:3003/api/game";

export async function joinGame(
  username,
  opponent,
  socketId
) {
  try {
    if (socketId === undefined) false;
    const body = {
      username,
      opponent,
      socketId,
    };
    const response = await fetch(baseURL + "/join-game", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!response.ok) throw new Error("failed to join game");
    if (!response) throw new Error("fetch failed");
    const data = await response.json();
    console.log(data);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function requestEndGame(
  username,
  opponent,
  isWin,
  points
) {
  try {
    const response = await fetch(baseURL + "/end-game", {
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
      body: JSON.stringify({
        username,
        opponent,
        isWin,
        points,
      }),
    });
    if (!response.ok) throw new Error("failed to end game");
  } catch (err) {
    console.error(err);
  }
}

export async function requestStartGame(
  username,
  opponent,
  gameObjectJson
) {
  try {
    const response = await fetch(baseURL + "/start-game", {
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
      body: JSON.stringify({
        username,
        opponent,
        gameObject: gameObjectJson,
      }),
    });
    if (!response.ok) throw new Error("failed to start game");
  } catch (err) {
    console.error(err);
  }
}

export async function notifyChangeTurn(
  username,
  opponent,
  message
) {
  try {
    const response = await fetch(baseURL + "/notify-change-turn", {
      method: "POST",
      body: JSON.stringify({
        username,
        opponent,
        message,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (response.status !== 200) throw new Error("failed to start game");
  } catch (err) {
    console.error(err);
  }
}

export async function requestUserSelect(
  username,
  opponent,
  json
) {
  try {
    const response = await fetch(baseURL + "/select", {
      method: "POST",
      body: JSON.stringify({
        username,
        opponent,
        json,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      timeout: AXIOS_TIMEOUT_MS,
    });
    if (response.status !== 200) throw new Error("failed to send select event");
    if (response) return true;
  } catch (err) {
    console.error(err);
    if (axios.isCancel(err)) {
      console.error("SELECT REQUEST TIMED OUT: ", err);
    }
    return false;
  }
}

export async function requestRollDice(
  username,
  opponent,
  turnJson
) {
  try {
    const response = await fetch(`${baseURL}/roll-dice`, {
      method: "POST",
      body: JSON.stringify({
        username,
        opponent,
        turnJson,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to roll dice");
    }
  } catch (err) {
    console.error(err);
  }
}

export const getStartingPlayer = async (username, opponent) => {
  try {
    const response = await fetch(`${baseURL}/get-first-player`, {
      method: "POST",
      body: JSON.stringify({
        users: [username, opponent],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to get starting player");
    }
    const data = await response.json();
    return data.result;
  } catch (err) {
    console.error(err);
  }
};
