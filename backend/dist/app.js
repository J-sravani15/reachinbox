"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const test_routes_1 = __importDefault(require("./routes/test.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const sender_routes_1 = __importDefault(require("./routes/sender.routes"));
const campaign_routes_1 = __importDefault(require("./routes/campaign.routes"));
const scheduled_email_routes_1 = __importDefault(require("./routes/scheduled-email.routes"));
const email_routes_1 = __importDefault(require("./routes/email.routes"));
const google_service_1 = __importDefault(require("./services/google.service"));
const lead_routes_1 = __importDefault(require("./routes/lead.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "reachinbox_secret_key",
    resave: false,
    saveUninitialized: false,
}));
app.use(google_service_1.default.initialize());
app.use(google_service_1.default.session());
app.use("/api", test_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/senders", sender_routes_1.default);
app.use("/api/campaigns", campaign_routes_1.default);
app.use("/api/scheduled-emails", scheduled_email_routes_1.default);
app.use("/api/emails", email_routes_1.default);
app.use("/api/leads", lead_routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map