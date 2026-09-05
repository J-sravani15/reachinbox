import { Router } from "express";

import {
  createScheduledEmail,
  getScheduledEmails,
} from "../controllers/scheduled-email.controller";

const router = Router();

router.post("/", createScheduledEmail);
router.get("/", getScheduledEmails);

export default router;