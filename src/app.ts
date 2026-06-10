import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/issues/issues.route";

const app: Application = express();

app.use(cookieParser());
app.use(express.json()); //* middleware for read JSON from body
app.use(express.text()); //* middleware for read TextData from body
app.use(express.urlencoded({ extended: true })); //* middleware for read En-coded Data

app.use(
  cors({
    origin: "*",
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Hello World! This is the backend server for the Issue Tracker application.",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);

export default app;
