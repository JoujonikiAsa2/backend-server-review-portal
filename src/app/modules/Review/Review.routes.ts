import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { ReviewControllers } from "./Review.controllers";

import { UserRole } from "@prisma/client";
import AuthGurd from "../../middleware/AuthGurd";
import { ReviewSchemas } from "./Review.ZodValidations";
import { UploadImageInServer } from "../../middleware/UploadImage";
import { UploadToCloudinary } from "../../../helpers/CloudinaryUpload";

const router = express.Router();

router.get(
  "/",
  //  AuthGurd(UserRole.ADMIN),
  ReviewControllers.GetAllReview
);

router.get(
  "/my-reviews",
  AuthGurd(UserRole.USER, UserRole.ADMIN),
  ReviewControllers.GetMyReviews
);


router.get(
  "/:id",
  //  AuthGurd(UserRole.ADMIN),
  ReviewControllers.GetReviewById
);


router.get("/count", ReviewControllers.GetReviewCount);
// Create review
router.post(
  "/create",
  AuthGurd(UserRole.USER, UserRole.ADMIN),
  UploadImageInServer.single("file"),
  UploadToCloudinary,
  validateRequest(ReviewSchemas.reviewCreationSchema),
  ReviewControllers.createReview
);

// update review
router.patch(
  "/update/:id",
  AuthGurd(UserRole.USER, UserRole.ADMIN),
  UploadImageInServer.single("file"),
  UploadToCloudinary,
  ReviewControllers.updateReview
);

// Delete review
router.delete(
  "/delete/:id",
  AuthGurd(UserRole.USER),
  ReviewControllers.deleteReview
);

// update votes
router.patch(
  "/update-vote/:id",
  AuthGurd(UserRole.USER),
  ReviewControllers.updateVotes
);

export const ReviewRoutes = router;
