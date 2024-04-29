import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = async (req, res, next) => {
  console.log("Line - 17" + process.env.JWT_SECRET_KEY)
  try {
    const userToken = req.header("authorization");
    if (!userToken) return res.status(401).json({ error: "unauthorization" });
    const token = userToken.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(payload);
    if (!payload){ 
      
    }
      req.user = payload;
    next();
  } catch (err) {
    console.log("error" + err);
    if (err.name === "TokenExpiredError") { 
      const userToken = req.header("authorization");
      if (!userToken) return res.status(401).json({ error: "unauthorization" });
      const token = userToken.split(" ")[1];
      const tokens = await refreshTokens(token);
      return res.status(401).json({ tokens });
    }
    return res.status(401).json({ error: "EXP" });
  }
};