import { UserRole } from "@prisma/client";
import express from "express";
import AuthGurd from "../../middleware/AuthGurd";
import { UploadImageInServer } from "../../middleware/UploadImage";
import validateRequest from "../../middleware/validateRequest";
import { UserControllers } from "./User.controllers";
import { UserSchemas } from "./User.ZodValidations";

import { UploadToCloudinary } from "../../../helpers/CloudinaryUpload";
const router = express.Router();

// Get all users
router.get("/", AuthGurd(UserRole.ADMIN), UserControllers.GetAllUsers);

// Create user
router.post(
  "/create",
  validateRequest(UserSchemas.userCreationSchema),
  UserControllers.registerUser
);

//update user
router.patch(
  "/update",
  AuthGurd(UserRole.USER, UserRole.ADMIN),
  UploadImageInServer.single("file"),
  UploadToCloudinary,
  validateRequest(UserSchemas.updateSchema),
  UserControllers.updateUser
);

export const UserRoutes = router;
