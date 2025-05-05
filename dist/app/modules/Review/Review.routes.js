"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const Review_controllers_1 = require("./Review.controllers");
const client_1 = require("@prisma/client");
const AuthGurd_1 = __importDefault(require("../../middleware/AuthGurd"));
const Review_ZodValidations_1 = require("./Review.ZodValidations");
const UploadImage_1 = require("../../middleware/UploadImage");
const CloudinaryUpload_1 = require("../../../helpers/CloudinaryUpload");
const router = express_1.default.Router();
router.get("/", 
//  AuthGurd(UserRole.ADMIN),
Review_controllers_1.ReviewControllers.GetAllReview);
// Create review
router.post("/create", (0, AuthGurd_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), UploadImage_1.UploadImageInServer.single("file"), CloudinaryUpload_1.UploadToCloudinary, (0, validateRequest_1.default)(Review_ZodValidations_1.ReviewSchemas.reviewCreationSchema), Review_controllers_1.ReviewControllers.createReview);
// update review
router.patch("/update/:id", (0, AuthGurd_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), UploadImage_1.UploadImageInServer.single("file"), CloudinaryUpload_1.UploadToCloudinary, (0, validateRequest_1.default)(Review_ZodValidations_1.ReviewSchemas.reviewUpdateSchema), Review_controllers_1.ReviewControllers.updateReview);
// Delete review
router.delete("/delete/:id", (0, AuthGurd_1.default)(client_1.UserRole.USER), Review_controllers_1.ReviewControllers.deleteReview);
// update votes
router.patch("/update-vote/:id", (0, AuthGurd_1.default)(client_1.UserRole.USER), Review_controllers_1.ReviewControllers.updateVotes);
router.get("/my-reviews", (0, AuthGurd_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), Review_controllers_1.ReviewControllers.getMyReviews);
router.get("/count", Review_controllers_1.ReviewControllers.getReviewCount);
router.get("/:id", 
//  AuthGurd(UserRole.ADMIN),
Review_controllers_1.ReviewControllers.GetReviewById);
router.patch("/:reviewId", Review_controllers_1.ReviewControllers.updateReviewStatus);
exports.ReviewRoutes = router;
