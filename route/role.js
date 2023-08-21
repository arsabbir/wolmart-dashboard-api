import express from "express";

import tokenVerity from "../middlewares/verifyToken.js";
import {
  createRole,
  deleteRole,
  getAllRole,
  getSingleRole,
  updateRole,
  updateRoleStatus
} from "../controllers/roleController.js";

const router = express.Router();

// use verify token
router.use(tokenVerity);

// create route
router.route("/").get(getAllRole).post(createRole);
router
  .route("/:id")
  .get(getSingleRole)
  .delete(deleteRole)
  .put(updateRole)
  .patch(updateRole);
  router.route("/status/:id").patch(updateRoleStatus);
// export default router
export default router;
