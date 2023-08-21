import express from "express";

import tokenVerity from "../middlewares/verifyToken.js";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getSingleBrand,
  updateBrand,
  updateBrandStatus,
} from "../controllers/brandController.js";
import { BrandMulter } from "../utils/multer.js";

const router = express.Router();

// use verify token
router.use(tokenVerity);

// create route
router.route("/").get(getAllBrand).post(BrandMulter, createBrand);
router
  .route("/:id")
  .get(getSingleBrand)
  .delete(deleteBrand)
  .put(BrandMulter, updateBrand)
  .patch(BrandMulter, updateBrand);
router.route("/status/:id").patch(updateBrandStatus);
// export default router
export default router;
