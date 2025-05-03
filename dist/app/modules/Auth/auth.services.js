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
exports.AuthServices = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
// new branch created
const prismaWithPassword = new client_1.PrismaClient();
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExists = yield prismaWithPassword.user.findUnique({
        where: {
            email,
        },
    });
    console.log(isUserExists);
    if (!isUserExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    const isPasswordValid = yield bcrypt_1.default.compare(password, isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password);
    if (!isPasswordValid)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid Credentials.");
    const loggedInUser = {
        name: isUserExists.name,
        email: isUserExists.email,
        role: isUserExists.role,
    };
    console.log(loggedInUser);
    return loggedInUser;
});
exports.AuthServices = {
    login,
};
