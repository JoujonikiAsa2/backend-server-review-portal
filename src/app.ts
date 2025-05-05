import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import router from "./app/routes";

const app: Application = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5174','https://backend-server-review-portal.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); 
    } else {
      callback(new Error('The CORS policy does not allow this origin'), false);
    }
  },
  credentials: true,
}));

app.use(cors({
  origin: true, 
  credentials: true
}));

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
