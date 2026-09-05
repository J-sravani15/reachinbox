import { Router } from "express";

import {
  createCampaign,
  getCampaigns,
  deleteCampaign,
  startCampaign,
  getCampaignStats,
} from "../controllers/campaign.controller";

const router = Router();

router.post("/", createCampaign);
router.get("/", getCampaigns);
router.delete("/:id", deleteCampaign);
router.post("/:id/start", startCampaign);
router.get("/:id/stats", getCampaignStats);

export default router;