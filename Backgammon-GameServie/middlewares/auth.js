import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { refreshTokens } from "../utils/utils.js";
dotenv.config();

export const auth = async (req, res, next) => {
  try {
    const userToken = req.header("authorization");
    if (!userToken) return res.status(401).json({ error: "unauthorization" });
    const token = userToken.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(payload)
    if (!payload){ 
      const tokens = await refreshTokens(token);
      payload = jwt.verify(tokens[0], process.env.JWT_SECRET_KEY);
    }
      req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "EXP" });
  }
};