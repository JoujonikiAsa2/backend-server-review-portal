import express from "express";
import auth from "../../middleware/AuthGurd";
import validateRequest from "../../middleware/validateRequest";
import AuthGurd from "../../middleware/AuthGurd";
import { CommentControllers } from "./Comment.controllers";
import { CommentSchemas } from "./Comment.ZodValidations";
import { UserRole } from "@prisma/client";

const router = express.Router();
// Get all Payments
router.get(
  "/:id",
  // AuthGurd(UserRole.ADMIN),
  CommentControllers.GetAllCommentById
);

// Create user
router.post(
  "/create",
  AuthGurd(UserRole.USER, UserRole.ADMIN),
  validateRequest(CommentSchemas.postCommentSchema),
  CommentControllers.PostComment
);

export const CommentRoutes = router;
