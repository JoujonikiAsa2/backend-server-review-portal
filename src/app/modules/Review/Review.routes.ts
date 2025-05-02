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

// Create user
router.post(
  "/create",
  AuthGurd(UserRole.USER, UserRole.ADMIN),
  UploadImageInServer.single("file"),
  UploadToCloudinary,
  validateRequest(ReviewSchemas.reviewCreationSchema),
  ReviewControllers.createReview
);

// update votes

router.patch("/update/:id", ReviewControllers.updateVotes);

export const ReviewRoutes = router;
