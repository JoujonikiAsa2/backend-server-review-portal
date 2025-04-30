import express from "express";
import { AuthControllers } from "./Auth.controllers";
import limiter from "../../middleware/rateLimiter";
import auth from "../../middleware/AuthGurd";
import validateRequest from "../../middleware/validateRequest";
import { AuthSchemas } from "./Auth.ZodValidations";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthSchemas.loginSchema),
  AuthControllers.login
);

export const AuthRoutes = router;
