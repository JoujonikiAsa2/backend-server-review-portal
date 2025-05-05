import express from "express";
import { PayementControllers } from "./Payment.controllers";

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
