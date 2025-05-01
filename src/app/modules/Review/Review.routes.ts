import express from "express";
import { ReviewControllers } from "./Review.controllers";
import auth from "../../middleware/AuthGurd";
import validateRequest from "../../middleware/validateRequest";

import AuthGurd from "../../middleware/AuthGurd";
import { UserRole } from "@prisma/client";
import { PaymentSchemas } from "../Payment/Payment.ZodValidations";
import { PayementControllers } from "../Payment/Payment.controllers";

const router = express.Router();
// Get all users
router.get(
  "/",
  // AuthGurd(UserRole.ADMIN),
  ReviewControllers.GetAllReview
);

// Create user
router.post(
  "/create",
  validateRequest(PaymentSchemas.paymentCreationSchema),
  ReviewControllers.createReview
);

export const ReviewRoutes = router;
