"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Payment_controllers_1 = require("./Payment.controllers");
const Payment_ZodValidations_1 = require("./Payment.ZodValidations");
const client_1 = require("@prisma/client");
const AuthGurd_1 = __importDefault(require("../../middleware/AuthGurd"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = express_1.default.Router();
router.get("/premium-review/count", (0, AuthGurd_1.default)(client_1.UserRole.ADMIN), Payment_controllers_1.PayementControllers.popularReviews);
router.post("/create-checkout-session", Payment_controllers_1.PayementControllers.createCheckoutSession);
router.post("/create", (0, AuthGurd_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), (0, validateRequest_1.default)(Payment_ZodValidations_1.PaymentSchemas.paymentCreationSchema), Payment_controllers_1.PayementControllers.createPayment);
router.get("/my-payments/:email", (0, AuthGurd_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), Payment_controllers_1.PayementControllers.getMyPayments);
router.get("/:id", (0, AuthGurd_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), Payment_controllers_1.PayementControllers.getPaymentById);
router.get("/", (0, AuthGurd_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), Payment_controllers_1.PayementControllers.getAllPayments);
exports.PaymentRoutes = router;
