"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sender_controller_1 = require("../controllers/sender.controller");
const router = (0, express_1.Router)();
router.post("/", sender_controller_1.createSender);
router.get("/", sender_controller_1.getSenders);
router.delete("/:id", sender_controller_1.deleteSender);
exports.default = router;
//# sourceMappingURL=sender.routes.js.map