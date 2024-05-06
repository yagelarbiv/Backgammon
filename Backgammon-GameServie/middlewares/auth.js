import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = async (req, res, next) => {
  try {
    const userToken = req.header("authorization");
    if (!userToken) return res.status(401).json({ error: "unauthorization" });
    const token = userToken.split(" ")[1];
    const payload = jwt.decode(token, process.env.JWT_SECRET_KEY);
    console.log(payload);
    if (!payload){ 
      
    }
      req.user = payload;
    next();
  } catch (err) {
    console.log("error" + err);
    if (err.name === "TokenExpiredError") { 
      return res.status(401).json({ error: "TokenExpiredError" });
    }
    return res.status(401).json({ error: "EXP" });
  }
};