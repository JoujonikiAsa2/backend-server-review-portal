"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const AuthGurd_1 = __importDefault(require("../../middleware/AuthGurd"));
const Comment_controllers_1 = require("./Comment.controllers");
const Comment_ZodValidations_1 = require("./Comment.ZodValidations");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Get all Payments
router.get("/:id", 
// AuthGurd(UserRole.ADMIN),
Comment_controllers_1.CommentControllers.GetAllCommentById);
// Create user
router.post("/create", (0, AuthGurd_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Comment_ZodValidations_1.CommentSchemas.postCommentSchema), Comment_controllers_1.CommentControllers.PostComment);
// update comment
router.patch("/update/:id", (0, AuthGurd_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), Comment_controllers_1.CommentControllers.updateComment);
// Delete comment
router.delete("/delete/:id", (0, AuthGurd_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), Comment_controllers_1.CommentControllers.deleteComment);
exports.CommentRoutes = router;
