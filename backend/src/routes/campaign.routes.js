"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaign_controller_1 = require("../controllers/campaign.controller");
const router = (0, express_1.Router)();
router.post("/", campaign_controller_1.createCampaign);
router.get("/", campaign_controller_1.getCampaigns);
router.delete("/:id", campaign_controller_1.deleteCampaign);
router.post("/:id/start", campaign_controller_1.startCampaign);
router.get("/:id/stats", campaign_controller_1.getCampaignStats);
exports.default = router;
//# sourceMappingURL=campaign.routes.js.map