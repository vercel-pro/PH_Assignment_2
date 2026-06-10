import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issues.service";
import { config } from "../../config";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

// Create issue
const createIssue = async (req: Request, res: Response) => {
  try {
    const token = req?.headers?.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    // * Token Decode and Verify Logic Here
    const decodedToken = jwt.verify(
      token as string,
      config.accessSecret as string,
    ) as JwtPayload;
    const userId = decodedToken.id;

    const result = await issueService.createIssueIntoDB(req.body, userId);

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully.",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message:
        error.code === "23514"
          ? "Invalid type. Type must be either 'bug' or 'feature_request'."
          : "Internal Server Error.",
      // message: error.message,
      error,
    });
  }
};

// Get all issues
const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssueFromDB(req.query);

    return res.status(200).json({
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

// Get Single Issue
const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const result = await issueService.getSingleIssueFromDB(id);
    return res.status(200).json({
      success: true,
      message: "Issue retrieved successfully",
      data: result,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

// Update Issue
const updateIssue = async (req: Request, res: Response) => {
  try {
    // Authorization Header
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify Token
    const decodedToken = jwt.verify(
      token,
      config.accessSecret as string,
    ) as JwtPayload;

    const id = Number(req.params.id);

    const result = await issueService.updateIssueIntoDB(
      id,
      req.body,
      decodedToken,
    );

    return res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

// Delete Issue
const deleteIssue = async (req: Request, res: Response) => {
  try {
    // Authorization Header
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify Token
    const decodedToken = jwt.verify(
      token,
      config.accessSecret as string,
    ) as JwtPayload;

    const id = Number(req.params.id);

    await issueService.deleteIssueFromDB(id, decodedToken);

    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
