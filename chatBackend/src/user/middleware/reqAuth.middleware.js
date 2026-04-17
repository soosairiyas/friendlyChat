import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../model/user.model.js";

dotenv.config();

export const reqAuth = async function (req, res, next) {
  try {
    const userToken = req.cookies.userjwtToken;
    console.log(">>>>>>>>userToken", userToken);

    if (!userToken) {
      return res.status(401).json({
        message: "Unauthorized No token provided!",
      });
    }
    const decoded = jwt.verify(userToken, process.env.CHAT_USER_JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.staus(401).json({
        message: "User Not Found ❌",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token 😕",
    });
  }
};
