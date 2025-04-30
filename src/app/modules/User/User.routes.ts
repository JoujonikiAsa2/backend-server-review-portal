import express from "express";
import { UserControllers } from "./User.controllers";
import limiter from "../../middleware/rateLimiter";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { UserSchemas } from "./User.ZodValidations";

const router = express.Router();

router.post(
  "/create",
  validateRequest(UserSchemas.userCreationSchema),
  UserControllers.registerUser
);

export const UserRoutes = router;
