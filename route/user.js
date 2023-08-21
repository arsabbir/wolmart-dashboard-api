import express from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
  updateUserStatus,
} from "../controllers/userController.js";
import tokenVerity from "../middlewares/verifyToken.js";

const router = express.Router();

// use verify token
router.use(tokenVerity);

// create route
router.route("/").get(getAllUser).post(createUser);
router.route("/:id").get(getSingleUser).delete(deleteUser).put(updateUser);
// update status user
router.route("/status/:id").patch(updateUserStatus);

// export default router
export default router;
