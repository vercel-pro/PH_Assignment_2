import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { authService } from "./auth.service";

// Create user
const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.userRegisterIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message:
        error.code === "23505"
          ? "Email already exists."
          : error.code === "23514"
            ? "Invalid role. Role must be either 'contributor' or 'maintainer'."
            : "Internal Server Error.",
      error,
    });
  }
};

// Login User
const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    // return console.log(result);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result.data,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: error.message || "Invalid credentials.",
      error: error,
    });
  }
};

export const authController = {
  signupUser,
  loginUser,
};
