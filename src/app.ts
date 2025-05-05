import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import router from "./app/routes";

const app: Application = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: true, // Reflects the request origin
  credentials: true, // Required for cookies, authorization headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions)); // Enable preflight for all routes

app.use(cookieParser());

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Backend is running successfully 🏃🏻‍♂️‍➡️",
  });
});

// API routes
app.use("/api/v1", router);

// Global error handler
app.use(globalErrorHandler);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;




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
