import express from "express";
import { UserControllers } from "./User.controllers";
// import limiter from "../../middleware/rateLimiter";
// import auth from "../../middleware/AuthGurd";
import validateRequest from "../../middleware/validateRequest";
import { UserSchemas } from "./User.ZodValidations";
import AuthGurd from "../../middleware/AuthGurd";
import { UserRole } from "@prisma/client";
import { UploadImageInServer } from "../../middleware/UploadImage";
// import { Readable } from "stream";
// import { v2 as cloudinary } from "cloudinary";
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
