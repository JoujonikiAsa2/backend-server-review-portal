"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_routes_1 = require("../modules/User/User.routes");
const AdminAnalytice_routes_1 = require("../modules/AdminAnalytices/AdminAnalytice.routes");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const Payment_routes_1 = require("../modules/Payment/Payment.routes");
const Review_routes_1 = require("../modules/Review/Review.routes");
const Comment_routes_1 = require("../modules/Comment/Comment.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/user",
        route: User_routes_1.UserRoutes,
    },
    {
        path: "/payment",
        route: Payment_routes_1.PaymentRoutes,
    },
    {
        path: "/review",
        route: Review_routes_1.ReviewRoutes,
    },
    {
        path: "/admin",
        route: AdminAnalytice_routes_1.AdminAnalyticesRoutes,
    },
    {
        path: "/comment",
        route: Comment_routes_1.CommentRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
