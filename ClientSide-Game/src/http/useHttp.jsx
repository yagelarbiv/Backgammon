import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";

const baseURL = "http://localhost:3003/api/game";

const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  
  useEffect(() => {
    if(!token) setError("Not authorized. Please log in.");
  }, []);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = axios.CancelToken.source();
      activeHttpRequests.current.push(httpAbortCtrl);

      headers["Authorization"] = token ? `Bearer ${token}` : "";

      try {
        const axiosRequestConfig = {
          method,
          url,
          data: body,
          headers,
          cancelToken: httpAbortCtrl.token,
        };
        const response = await axios(axiosRequestConfig);

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        setIsLoading(false);
        return response.data;
      } catch (err) {
        const error = err; 
        setError(error.message);
        setIsLoading(false);
        throw err;
      }
    },
    [token]
  );

  const clearError = () => {
    setError(null);
  };

  const joinGame = async (username, opponent, socketId) => {
    try {
      if (socketId === undefined) false;
      const body = {
        username,
        opponent,
        socketId,
      };
      const response = await sendRequest(
        baseURL + "/join-game",
        "POST",
        body,
        { authorization: `Bearer ${token}` }
      );
      if (!response) throw new Error("failed to join game");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) =>
        abortCtrl.cancel("React component unmounted.")
      );
    };
  }, []);

  return { isLoading, error, sendRequest, clearError, joinGame };
};

export default useHttpClient;
