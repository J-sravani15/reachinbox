"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const google_service_1 = __importDefault(require("../services/google.service"));
const router = (0, express_1.Router)();
router.get("/google", google_service_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
router.get("/google/callback", google_service_1.default.authenticate("google", {
    failureRedirect: "/login",
    session: true,
}), (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map