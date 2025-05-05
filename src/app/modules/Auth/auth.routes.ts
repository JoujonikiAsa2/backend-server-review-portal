import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthControllers } from "./auth.controllers";
import { AuthSchemas } from "./Auth.ZodValidations";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthSchemas.loginSchema),
  AuthControllers.login
);

export const AuthRoutes = router;
