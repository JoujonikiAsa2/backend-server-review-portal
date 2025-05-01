import express from "express";
import { UserControllers } from "./User.controllers";
import limiter from "../../middleware/rateLimiter";
import auth from "../../middleware/AuthGurd";
import validateRequest from "../../middleware/validateRequest";
import { UserSchemas } from "./User.ZodValidations";
import AuthGurd from "../../middleware/AuthGurd";
import { UserRole } from "@prisma/client";

const router = express.Router();
// Get all users
router.get("/", AuthGurd(UserRole.ADMIN), UserControllers.GetAllUsers);

// Create user
router.post(
  "/create",
  validateRequest(UserSchemas.userCreationSchema),
  UserControllers.registerUser
);

export const UserRoutes = router;
