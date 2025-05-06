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
  "/unpublished",
  AuthGurd(UserRole.ADMIN),
  ReviewControllers.getUnpublishedReviews
);

router.get(
  "/my-reviews",
  AuthGurd(UserRole.USER, UserRole.ADMIN),
  ReviewControllers.getMyReviews
);
router.get("/count", ReviewControllers.getReviewCount);

router.get(
  "/:id",
  //  AuthGurd(UserRole.ADMIN),
  ReviewControllers.GetReviewById
);

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
  validateRequest(ReviewSchemas.reviewUpdateSchema),
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


router.patch("/:reviewId", ReviewControllers.updateReviewStatus)



export const ReviewRoutes = router;