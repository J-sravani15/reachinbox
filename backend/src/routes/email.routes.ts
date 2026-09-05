import { Router } from "express";
import {
  sendTestEmail,
  queueTestEmail,
} from "../controllers/email.controller";

const router = Router();

router.post("/test", sendTestEmail);
router.post("/queue-test", queueTestEmail);

export default router;