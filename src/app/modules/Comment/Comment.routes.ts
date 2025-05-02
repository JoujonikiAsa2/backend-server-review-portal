import express from "express";
import auth from "../../middleware/AuthGurd";
import validateRequest from "../../middleware/validateRequest";
import AuthGurd from "../../middleware/AuthGurd";
import { PaymentSchemas } from "./Comment.ZodValidations";
import { CommentControllers } from "./Comment.controllers";

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
  // validateRequest(PaymentSchemas.paymentCreationSchema),
  CommentControllers.PostComment
);

export const CommentRoutes = router;
