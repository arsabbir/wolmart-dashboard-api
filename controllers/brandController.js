import asyncHandler from "express-async-handler";
import Brand from "../models/Brand.js";
import fs from "fs/promises";
import path from "path";
// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);
import { createSlug } from "../helper/slug.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "drq2ieflq",
  api_key: "718961483599887",
  api_secret: "zaM4dfcS2djdofxgDNhLla_tABk",
});

/**
 * @DESC Get all brands data
 * @ROUTE /api/v1/brand
 * @method GET
 * @access public
 */

export const getAllBrand = asyncHandler(async (req, res) => {
  const brands = await Brand.find();

  if (brands.length === 0) {
    return res.status(404).json({ message: "User data not found" });
  }
  res.status(200).json(brands);
  //   if (brands.length > 0) {
  //     res.status(200).json({brands,message:"Brand Create Success"});
  //   }
});

/**
 * @DESC Get Single brands data
 * @ROUTE /api/v1/brand/:id
 * @method GET
 * @access public
 */
export const getSingleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);

  if (!brand) {
    return res.status(404).json({ message: "Brand data not found" });
  }

  res.status(200).json(brand);
});

/**
 * @DESC Create new Brand
 * @ROUTE /api/v1/brand
 * @method POST
 * @access public
 */
export const createBrand = asyncHandler(async (req, res) => {
  // get values
  const { name } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "brand name is required" });
  }
  // email check
  const nameCheck = await Brand.findOne({ name });

  if (nameCheck) {
    return res.status(400).json({ message: "Brand already exists" });
  }
  const result = await cloudinary.uploader.upload(req.file.path);

  // create new brand
  const brand = await Brand.create({
    name,
    slug: createSlug(name),
    photo: result.secure_url,
  });

  res.status(200).json({ brand, message: "brand created successfully" });
});

/**
 * @DESC Delete Brand
 * @ROUTE /api/v1/brand/:id
 * @method DELETE
 * @access public
 */
export const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  const brandDelete = await Brand.findByIdAndDelete(id);
  if (brand.photo) {
    const publicId = brand.photo.match(/\/([^/]+)$/)[1].split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  }
  console.log(brandDelete);
  res.status(200).json(brandDelete);
});

/**
 * @DESC Update Brand
 * @ROUTE /api/v1/brand/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Brand name is required" });
  }

  const brand = await Brand.findById(id);

  if (!brand) {
    return res.status(404).json({ message: "Brand data not found" });
  } else {
    // Check if a file was uploaded
    if (req.file) {
      console.log("brand file done");
      // Delete the previous photo if it exists
      if (brand.photo) {
        const publicId = brand.photo.match(/\/([^/]+)$/)[1].split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      // Update the brand's photo field with the new photo data
      brand.photo = result.secure_url;
    }

    // Update the brand's name and slug
    brand.name = name;
    brand.slug = createSlug(name);

    // Save the updated brand
    await brand.save();

    res.status(200).json({ brand, message: "Brand data updated successfully" });
  }
});
/**
 * @DESC Update Brand Status
 * @ROUTE /api/v1/brand/status/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateBrandStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    { new: true }
  );

  res.status(200).json({ brand, messgae: "Status updated successfully" });
});
