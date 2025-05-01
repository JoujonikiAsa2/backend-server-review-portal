import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserServices } from "./User.services";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";

const registerUser = catchAsync(async (req, res) => {
  const result = await UserServices.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User Created Successfully.",
    data: result,
  });
});
const GetAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.GetAllUsersFromDB();

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User Created Successfully.",
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  GetAllUsers
};
