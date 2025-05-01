import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import status from "http-status";

const AuthGurd = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) throw new ApiError(status.FORBIDDEN, "Invalid token");

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_token_secret as Secret
      );
      req.user = verifiedUser;
      if (roles.length && !roles.includes(verifiedUser.userRole.toUpperCase()))
        throw new ApiError(status.FORBIDDEN, "You are not authorized");
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default AuthGurd;
