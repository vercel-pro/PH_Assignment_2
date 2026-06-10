import { Router } from "express";
import { issueController } from "./issues.controller";

const router = Router();

router.post("/", issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.patch("/:id", issueController.updateIssue);
router.delete("/:id", issueController.deleteIssue);

export const issueRoute = router;
