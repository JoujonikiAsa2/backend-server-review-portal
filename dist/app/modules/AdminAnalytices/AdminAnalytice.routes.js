"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticesRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const AuthGurd_1 = __importDefault(require("../../middleware/AuthGurd"));
const AdminAnalytices_controller_1 = require("./AdminAnalytices.controller");
const router = express_1.default.Router();
// Get analytics (including all reviews)
router.get("/analytics", (0, AuthGurd_1.default)(client_1.UserRole.ADMIN), AdminAnalytices_controller_1.AdminAnalyticsController.getAdminAnalytics);
router.get("/reviews", (0, AuthGurd_1.default)(client_1.UserRole.ADMIN), AdminAnalytices_controller_1.AdminAnalyticsController.getAllReviews);
exports.AdminAnalyticesRoutes = router; // Make sure to export the router
