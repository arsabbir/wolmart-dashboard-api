import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
/**
 * @DESC Login User
 * @ROUTE /api/v1/auth/login
 * @method POST
 * @access public
 */

export const login = asyncHandler(async (req, res) => {
  // get value
  const { email, password } = req.body;

  //   validation
  if (!email || !password) {
    return res.status(400).json({ message: "All fields must be completed" });
  }
  //   find login user
  const loginUser = await User.findOne({ email }).populate("role");

  if (!loginUser) {
    return res.status(400).json({ message: "Not Found User" });
  }
  //   check password
  const passCheck = await bcrypt.compare(password, loginUser.password);
  if (!passCheck) {
    return res.status(400).json({ message: "Wrong password" });
  }
  //   create access token
  const token = jwt.sign(
    { email: loginUser.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
  );
  //   create refresh token
  const refreshToken = jwt.sign(
    { email: loginUser.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
  );
  //   set token cookie
  res.cookie("accessToken", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.APP_ENV == "Development" ? false : true,
    sameSite: "strict",
  });

  return res.status(200).json({
    token,
    refreshToken,
    user: loginUser,
    message: "Login successful",
  });
});
/**
 * @DESC Logout User
 * @ROUTE /api/v1/auth/logout
 * @method POST
 * @access public
 */

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  return res.status(200).json({ message: "Logout Successful" });
});

/**
 * @DESC Register new User
 * @ROUTE /api/v1/user
 * @method POST
 * @access public
 */
export const register = asyncHandler(async (req, res) => {
  // get values
  const { name, email, password } = req.body;

  // validations
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // email check
  const emailCheck = await User.findOne({ email });

  if (emailCheck) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // hash password
  const hashPass = await bcrypt.hash(password, 10);
  // create new user
  const user = await User.create({
    name,
    email,
    password: hashPass,
  });

  res.status(200).json({ user, message: "Data created successfull" });
});

/**
 * @DESC LoggIn User
 * @ROUTE /api/v1/auth/me
 * @method POST
 * @access public
 */

export const loggedInUser = asyncHandler(async (req, res) => {
  return res.status(200).json(req.me);
});
