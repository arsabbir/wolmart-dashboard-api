import asyncHandler from "express-async-handler";
import Tag from "../models/Tag.js";

import { createSlug } from "../helper/slug.js";

/**
 * @DESC Get all tags data
 * @ROUTE /api/v1/tag
 * @method GET
 * @access public
 */

export const getAllTag = asyncHandler(async (req, res) => {
    
  const tags = await Tag.find();

  if (tags.length === 0) {
    return res.status(404).json({ message: "User data not found" });
  }
  res.status(200).json(tags);
//   if (tags.length > 0) {
//     res.status(200).json({tags,message:"Tag Create Success"});
//   }
});

/**
 * @DESC Get Single tags data
 * @ROUTE /api/v1/tag/:id
 * @method GET
 * @access public
 */
export const getSingleTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tag = await Tag.findById(id);

  if (!tag) {
    return res.status(404).json({ message: "Tag data not found" });
  }

  res.status(200).json(tag);
});

/**
 * @DESC Create new Tag
 * @ROUTE /api/v1/tag
 * @method POST
 * @access public
 */
export const createTag = asyncHandler(async (req, res) => {
  // get values
  const { name, permissions } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "tag name is required" });
  }
  // email check
  const nameCheck = await Tag.findOne({ name });

  if (nameCheck) {
    return res.status(400).json({ message: "Tag already exists" });
  }
  // create new tag
  const tag = await Tag.create({
    name,
    slug: createSlug(name),
    permissions,
  });

  res.status(200).json({ tag, message: "tag created successfully" });
});

/**
 * @DESC Delete Tag
 * @ROUTE /api/v1/tag/:id
 * @method DELETE
 * @access public
 */
export const deleteTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tag = await Tag.findByIdAndDelete(id);

  res.status(200).json(tag);
});

/**
 * @DESC Update Tag
 * @ROUTE /api/v1/tag/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { name, permissions } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Tag name is required" });
  }

  const tag = await Tag.findByIdAndUpdate(
    id,
    {
      name,
      slug: createSlug(name),
      permissions,
    },
    { new: true }
  );

  res.status(200).json({ tag, message: "Data updated successfully" });
});

/**
 * @DESC Update Permission Status
 * @ROUTE /api/v1/permission/status/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateTagStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const tag = await Tag.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    { new: true }
  );

  res.status(200).json({ tag, messgae: "Status updated successfully" });
});
