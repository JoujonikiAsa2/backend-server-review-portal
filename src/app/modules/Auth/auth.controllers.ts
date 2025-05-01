import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";

import status from "http-status";
import config from "../../../config";
import { generateToken } from "../../../helpers/jwtHelpers";
import sendResponse from "../../shared/sendResponse";
import { AuthServices } from "./auth.services";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.login(req.body);
  let { name, email, role } = result;
  const userRole = role.toLowerCase();
  const tokenData = {
    name,
    email,
    userRole,
  };
  console.log(tokenData);
  const accessToken = await generateToken(
    tokenData,
    config.jwt.access_token_secret!,
    "access"
  );
  const refreshToken = await generateToken(
    tokenData,
    config.jwt.refresh_token_secret!,
    "access"
  );
  console.log(accessToken, refreshToken);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged In Successfully",
    data: {
      ...result,
      redirectUrl: `/dashboard/${userRole}/profile`,
      role: role,
      accessToken,
      refreshToken,
    },
  });
});

export const AuthControllers = {
  login,
};
