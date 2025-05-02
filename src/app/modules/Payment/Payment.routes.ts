import express from "express";
import auth from "../../middleware/AuthGurd";
import validateRequest from "../../middleware/validateRequest";
import AuthGurd from "../../middleware/AuthGurd";
import { PayementControllers } from "./Payment.controllers";
import { PaymentSchemas } from "./Payment.ZodValidations";

const router = express.Router();
// Get all Payments
router.get(
  "/",
  // AuthGurd(UserRole.ADMIN),
  PayementControllers.GetAllPayment
);

// Create user
router.post(
  "/create",
  // validateRequest(PaymentSchemas.paymentCreationSchema),
  PayementControllers.createPayment
);

export const PaymentRoutes = router;
