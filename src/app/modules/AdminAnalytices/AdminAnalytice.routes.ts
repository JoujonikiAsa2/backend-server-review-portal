import { UserRole } from "@prisma/client";
import express from "express";
import AuthGurd from "../../middleware/AuthGurd";
import { AdminAnalyticsController } from "./AdminAnalytices.controller";
const router = express.Router();

// Get analytics (including all reviews)
router.get(
  "/analytics",
  AuthGurd(UserRole.ADMIN),
  AdminAnalyticsController.getAdminAnalytics
);

router.get(
  "/reviews",
  AuthGurd(UserRole.ADMIN),
  AdminAnalyticsController.getAllReviews
);

export const AdminAnalyticesRoutes = router; // Make sure to export the router
