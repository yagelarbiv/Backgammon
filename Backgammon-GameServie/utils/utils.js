import axios from "axios";
export function existsInMap(name, map) {
    const arr = Object.keys(map);
    return arr.includes(name);
  }
  
  export function getGameId(username, opponent) {
    const sortedNames = [username, opponent].sort();
    return sortedNames.join("-");
  }
export async function refreshTokens(Token) {
  const response = await axios.post("https://localhost:6001/api/Auth/refresh", {
    accessToken: Token,
  });
return response.data;
}