import express from "express";

import tokenVerity from "../middlewares/verifyToken.js";
import {
  createPermission,
  deletePermission,
  getAllPermission,
  getSinglePermission,
  updatePermission,
  updatePermissionStatus,
} from "../controllers/permissionController.js";

const router = express.Router();

// use verify token
router.use(tokenVerity);

// create route
router.route("/").get(getAllPermission).post(createPermission);
router
  .route("/:id")
  .get(getSinglePermission)
  .delete(deletePermission)
  .put(updatePermission)
  .patch(updatePermission);
router.route("/status/:id").patch(updatePermissionStatus);

// export default router
export default router;
