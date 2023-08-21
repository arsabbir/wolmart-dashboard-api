import asyncHandler from "express-async-handler";
import Role from "../models/Role.js";

import { createSlug } from "../helper/slug.js";

/**
 * @DESC Get all roles data
 * @ROUTE /api/v1/role
 * @method GET
 * @access public
 */
export const getAllRole = asyncHandler(async (req, res) => {
  const roles = await Role.find();

  if (roles.length > 0) {
    res.status(200).json(roles);
  }
});

/**
 * @DESC Get Single roles data
 * @ROUTE /api/v1/role/:id
 * @method GET
 * @access public
 */
export const getSingleRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findById(id);

  if (!role) {
    return res.status(404).json({ message: "Role data not found" });
  }

  res.status(200).json(role);
});

/**
 * @DESC Create new Role
 * @ROUTE /api/v1/role
 * @method POST
 * @access public
 */
export const createRole = asyncHandler(async (req, res) => {
  // get values
  const { name, permissions } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "role name is required" });
  }
  // email check
  const nameCheck = await Role.findOne({ name });

  if (nameCheck) {
    return res.status(400).json({ message: "Role already exists" });
  }
  // create new role
  const role = await Role.create({
    name,
    slug: createSlug(name),
    permissions,
  });

  res.status(200).json({ role, message: "role created successfully" });
});

/**
 * @DESC Delete Role
 * @ROUTE /api/v1/role/:id
 * @method DELETE
 * @access public
 */
export const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findByIdAndDelete(id);

  res.status(200).json(role);
});

/**
 * @DESC Update Role
 * @ROUTE /api/v1/role/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { name, permissions } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Role name is required" });
  }

  const role = await Role.findByIdAndUpdate(
    id,
    {
      name,
      slug: createSlug(name),
      permissions,
    },
    { new: true }
  );

  res.status(200).json({ role, message: "Data updated successfully" });
});

/**
 * @DESC Update Permission Status
 * @ROUTE /api/v1/permission/status/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateRoleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const role = await Role.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    { new: true }
  );

  res.status(200).json({ role, messgae: "Status updated successfully" });
});
