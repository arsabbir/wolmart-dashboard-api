import express from "express";

import tokenVerity from "../middlewares/verifyToken.js";
import { createTag, deleteTag, getAllTag, getSingleTag, updateTag, updateTagStatus } from "../controllers/tagController.js";

const router = express.Router();

// use verify token
router.use(tokenVerity);

// create route
router.route("/").get(getAllTag).post(createTag);
router.route("/:id").get(getSingleTag)
  .delete(deleteTag)
  .put(updateTag)
  .patch(updateTag);
  router.route("/status/:id").patch(updateTagStatus);
// export default router
export default router;
