"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const registerUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = payload;
    // Check if user already exists
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (user)
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User Already Exists.");
    // Hash password
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    const userData = {
        name,
        email,
        password: hashedPassword,
    };
    // Create user in DB
    const result = yield prisma_1.default.user.create({
        data: userData,
    });
    return result;
});
const updateUserInDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.update({
        where: {
            email: user.email,
        },
        data: payload,
    });
    const updatedUser = yield prisma_1.default.user.findUnique({
        where: {
            email: user.email,
        },
    });
    return updatedUser;
});
const GetAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            imageUrl: true,
            createdAt: true,
        },
    });
    return users;
});
exports.UserServices = {
    registerUserIntoDB,
    GetAllUsersFromDB,
    updateUserInDB,
};
