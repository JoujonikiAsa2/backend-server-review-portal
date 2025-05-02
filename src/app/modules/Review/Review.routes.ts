import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { ReviewControllers } from "./Review.controllers";

import { UserRole } from "@prisma/client";
import AuthGurd from "../../middleware/AuthGurd";
import { PaymentSchemas } from "../Payment/Payment.ZodValidations";

const router = express.Router();
// Get all users
router.get("/", AuthGurd(UserRole.ADMIN), ReviewControllers.GetAllReview);

// Create user
router.post(
  "/create",
  validateRequest(PaymentSchemas.paymentCreationSchema),
  ReviewControllers.createReview
);

export const ReviewRoutes = router;
