import express from "express";
import { PayementControllers } from "./Payment.controllers";
import { PaymentSchemas } from "./Payment.ZodValidations";
import { UserRole } from "@prisma/client";
import AuthGurd from "../../middleware/AuthGurd";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.get(
  "/premium-review/count",
  AuthGurd(UserRole.ADMIN),
  PayementControllers.popularReviews
);

router.post(
  "/create-checkout-session",
  PayementControllers.createCheckoutSession
);

router.post(
  "/create",
  AuthGurd(UserRole.ADMIN, UserRole.USER),
  validateRequest(PaymentSchemas.paymentCreationSchema),
  PayementControllers.createPayment
);

router.get(
  "/my-payments/:email",
  AuthGurd(UserRole.ADMIN, UserRole.USER),
  PayementControllers.getMyPayments
)
router.get(
  "/:id",
  AuthGurd(UserRole.ADMIN, UserRole.USER),
  PayementControllers.getPaymentById
)

router.get(
  "/",
  AuthGurd(UserRole.ADMIN, UserRole.USER),
  PayementControllers.getAllPayments
);


export const PaymentRoutes = router;
