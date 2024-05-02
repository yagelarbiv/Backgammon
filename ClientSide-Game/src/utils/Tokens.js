import axios from "axios";
export async function refreshAccessToken(RefreshToken) {
  const response = await axios.post("https://localhost:6001/api/Auth/refresh", {
    RefreshToken: RefreshToken,
  });
  console.log(response.data);
  return response.data;
}