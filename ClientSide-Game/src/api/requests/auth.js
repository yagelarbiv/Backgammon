import axios from "axios";
const authUrl = import.meta.env.VITE_APP_AUTH_URL;

export const logOut = async (accessToken) => {
  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const response = await axios.post(`${authUrl}/logout`, {
      withCredentials: true,
    });
    console.log(response);
    return response
  } 
  catch (err) {
    console.log(err.response);
    return err.response
  }
};
export async function refreshAccessToken(RefreshToken) {
  try {
    const response = await axios.post(`${authUrl}/refresh`, {
      RefreshToken: RefreshToken,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error); 
  }
}

export const LogingIn = async (userName, password) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(authUrl + "/login", {
        Headers: {
          withCredentials: true // Only set this if you need to send credentials
        },
        UserName: userName,
        Password: password,
      });
      return response;
    } catch (err) {
      console.log(err);
      return false;
    }
}
export const Registeration = async (userName, password, confirmPassword) => {
    console.log(userName, password);
    try {
        const response = await axios.post(authUrl + "/register", {
        UserName: userName,
        Password: password,
        ConfirmPassword: confirmPassword,
      });
      return response;
    } catch (err) {
      console.log(err);
      return false;
    }
}