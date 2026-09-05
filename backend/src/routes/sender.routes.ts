import { Router } from "express";

import {
  createSender,
  getSenders,
  deleteSender,
} from "../controllers/sender.controller";

const router = Router();

router.post("/", createSender);
router.get("/", getSenders);
router.delete("/:id", deleteSender);

export default router;