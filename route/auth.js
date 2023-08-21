import express from "express";
import { login, logout, register,loggedInUser } from "../controllers/authController.js";
import tokenVerity from "../middlewares/verifyToken.js";

const router = express.Router();

// create router
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/register").post(register);
router.route("/me").get(tokenVerity,loggedInUser);

// export default router
export default router;
