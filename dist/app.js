"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
// Enhanced CORS configuration
const corsOptions = {
    origin: true, // Reflects the request origin
    credentials: true, // Required for cookies, authorization headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};
app.use((0, cors_1.default)(corsOptions));
// Handle preflight requests
app.options('*', (0, cors_1.default)(corsOptions)); // Enable preflight for all routes
app.use((0, cookie_parser_1.default)());
// Parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Test route
app.get("/", (req, res) => {
    res.send({
        Message: "Backend is running successfully 🏃🏻‍♂️‍➡️",
    });
});
// API routes
app.use("/api/v1", routes_1.default);
// Global error handler
app.use(globalErrorHandler_1.default);
// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!",
        },
    });
});
exports.default = app;
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import express, { Application, NextFunction, Request, Response } from "express";
// import globalErrorHandler from "./app/middleware/globalErrorHandler";
// import router from "./app/routes";
// const app: Application = express();
// // CORS configuration
// app.use(cors());
// app.use(cookieParser());
// //parser
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.get("/", (req: Request, res: Response) => {
//   res.send({
//     Message: "Backend is running successfully 🏃🏻‍♂️‍➡️",
//   });
// });
// app.use("/api/v1", router);
// app.use(globalErrorHandler);
// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.status(404).json({
//     success: false,
//     message: "API NOT FOUND!",
//     error: {
//       path: req.originalUrl,
//       message: "Your requested path is not found!",
//     },
//   });
// });
// export default app;
