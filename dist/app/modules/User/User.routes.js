"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const User_controllers_1 = require("./User.controllers");
// import limiter from "../../middleware/rateLimiter";
// import auth from "../../middleware/AuthGurd";
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const User_ZodValidations_1 = require("./User.ZodValidations");
const AuthGurd_1 = __importDefault(require("../../middleware/AuthGurd"));
const client_1 = require("@prisma/client");
const UploadImage_1 = require("../../middleware/UploadImage");
// import { Readable } from "stream";
// import { v2 as cloudinary } from "cloudinary";
const CloudinaryUpload_1 = require("../../../helpers/CloudinaryUpload");
const router = express_1.default.Router();
// Get all users
router.get("/", (0, AuthGurd_1.default)(client_1.UserRole.ADMIN), User_controllers_1.UserControllers.GetAllUsers);
// Create user
router.post("/create", (0, validateRequest_1.default)(User_ZodValidations_1.UserSchemas.userCreationSchema), User_controllers_1.UserControllers.registerUser);
//update user
router.patch("/update", (0, AuthGurd_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), UploadImage_1.UploadImageInServer.single("file"), CloudinaryUpload_1.UploadToCloudinary, (0, validateRequest_1.default)(User_ZodValidations_1.UserSchemas.updateSchema), User_controllers_1.UserControllers.updateUser);
exports.UserRoutes = router;
