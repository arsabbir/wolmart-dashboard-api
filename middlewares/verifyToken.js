import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import jwt, { decode } from "jsonwebtoken";

const tokenVerity = (req, res, next) => {
  // const authHeader = req.headers.authorization || req.headers.Authorization;
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(400).json({ message: "Unauthorization" });
  }

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    asyncHandler(async (err, decode) => {
      if (err) {
        return res.status(400).json({ message: "Invalid Token" });
      }
      const me = await User.findOne({ email: decode.email })
        .select("-password")
        .populate("role");
      req.me = me;
      next();
    })
  );
};

export default tokenVerity;
