"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (smtpHost, smtpPort, smtpUser, smtpPassword, from, to, subject, html) => {
    const transporter = nodemailer_1.default.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false,
        auth: {
            user: smtpUser,
            pass: smtpPassword,
        },
    });
    return transporter.sendMail({
        from,
        to,
        subject,
        html,
    });
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.service.js.map