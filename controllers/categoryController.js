import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

import { createSlug } from "../helper/slug.js";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "drq2ieflq",
  api_key: "718961483599887",
  api_secret: "zaM4dfcS2djdofxgDNhLla_tABk",
});

/**
 * @DESC Get all categories data
 * @ROUTE /api/v1/category
 * @method GET
 * @access public
 */

export const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  if (categories.length === 0) {
    return res.status(404).json({ message: "User data not found" });
  }
  res.status(200).json(categories);
  //   if (categories.length > 0) {
  //     res.status(200).json({categories,message:"Category Create Success"});
  //   }
});

/**
 * @DESC Get Single categories data
 * @ROUTE /api/v1/category/:id
 * @method GET
 * @access public
 */
export const getSingleCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({ message: "Category data not found" });
  }

  res.status(200).json(category);
});

/**
 * @DESC Create new Category
 * @ROUTE /api/v1/category
 * @method POST
 * @access public
 */
export const createCategory = asyncHandler(async (req, res) => {

  // get values
  const { name } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "category name is required" });
  }
  // email check
  const nameCheck = await Category.findOne({ name });

  if (nameCheck) {
    return res.status(400).json({ message: "Category already exists" });
  }
  const result = await cloudinary.uploader.upload(req.file.path);
  // create new category
  const category = await Category.create({
    name,
    slug: createSlug(name),
    photo: result.secure_url,
  });

  res.status(200).json({ category, message: "category created successfully" });
});

/**
 * @DESC Delete Category
 * @ROUTE /api/v1/category/:id
 * @method DELETE
 * @access public
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  res.status(200).json(category);
});

/**
 * @DESC Update Brand
 * @ROUTE /api/v1/category/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateCategory = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({ message: "Category data not found" });
  } else {
    // Check if a file was uploaded
    if (req.file) {
      // Delete the previous photo if it exists
      if (category.photo) {
        const publicId = category.photo.match(/\/([^/]+)$/)[1].split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      // Update the category's photo field with the new photo data
      category.photo = result.secure_url;
    }

    // Update the category's name and slug
    category.name = name;
    category.slug = createSlug(name);

    // Save the updated category
    await category.save();

    res.status(200).json({ category, message: "Category data updated successfully" });
  }
});

/**
 * @DESC Update Permission Status
 * @ROUTE /api/v1/permission/status/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateCategoryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    { new: true }
  );

  res.status(200).json({ category, messgae: "Status updated successfully" });
});
