"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scheduled_email_controller_1 = require("../controllers/scheduled-email.controller");
const router = (0, express_1.Router)();
router.post("/", scheduled_email_controller_1.createScheduledEmail);
router.get("/", scheduled_email_controller_1.getScheduledEmails);
exports.default = router;
//# sourceMappingURL=scheduled-email.routes.js.map