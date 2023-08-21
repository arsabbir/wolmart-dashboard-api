import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/mail.js";

/**
 * @DESC Get all users data
 * @ROUTE /api/v1/user
 * @method GET
 * @access public
 */
export const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find().populate("role");

  if (users.length === 0) {
    return res.status(404).json({ message: "User data not found" });
  }

  res.status(200).json(users);
});

/**
 * @DESC Get Single users data
 * @ROUTE /api/v1/user/:id
 * @method GET
 * @access public
 */
export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User data not found" });
  }

  res.status(200).json(user);
});

/**
 * @DESC Create new User
 * @ROUTE /api/v1/user
 * @method POST
 * @access public
 */
export const createUser = asyncHandler(async (req, res) => {
  // get values
  const { name, email, password, role } = req.body;

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
    role,
  });

  // send user access email
  sendMail({
    to: `${email}`,
    subject: "Account Verification Info",
    msg: `your login access is email : ${email},password: ${password} `,
    name: `${name}`,
  });

  res.status(200).json({ user, message: ` user create succefull ` });
});

/**
 * @DESC Delete User
 * @ROUTE /api/v1/user/:id
 * @method DELETE
 * @access public
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  res.status(200).json(user);
});

/**
 * @DESC Update User
 * @ROUTE /api/v1/user/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { name, email, mobile, password, gender } = req.body;

  if (!name || !email || !mobile || !password || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findByIdAndUpdate(
    id,
    {
      name,
      email,
      mobile,
      password,
      gender,
    },
    { new: true }
  );

  res.status(200).json(user);
});
/**
 * @DESC Update User Status
 * @ROUTE /api/v1/user/status/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    { new: true }
  );

  res.status(200).json({ user, messgae: "Status updated successfully" });
});
