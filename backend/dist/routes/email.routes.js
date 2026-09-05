"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_controller_1 = require("../controllers/email.controller");
const router = (0, express_1.Router)();
router.post("/test", email_controller_1.sendTestEmail);
router.post("/queue-test", email_controller_1.queueTestEmail);
exports.default = router;
//# sourceMappingURL=email.routes.js.map