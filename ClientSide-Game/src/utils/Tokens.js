import axios from "axios";
export async function refreshAccessToken(accessToken) {
  const response = await axios.post("https://localhost:6001/api/Auth/refresh", {
    accessToken: accessToken,
  });
  return response.data;
}