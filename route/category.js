import express from "express";

import tokenVerity from "../middlewares/verifyToken.js";

import { createCategory, deleteCategory, getAllCategory, getSingleCategory, updateCategory, updateCategoryStatus } from "../controllers/categoryController.js";
import { CategoryMulter } from "../utils/multer.js";

const router = express.Router();

// use verify token
router.use(tokenVerity);

// create route
router.route("/").get(getAllCategory).post(CategoryMulter,createCategory);
router.route("/:id").get(getSingleCategory)
  .delete(deleteCategory)
  .put(CategoryMulter,updateCategory)
  .patch(CategoryMulter,updateCategory);
  router.route("/status/:id").patch(updateCategoryStatus);
// export default router
export default router;
