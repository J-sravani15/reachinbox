"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSender = exports.getSenders = exports.createSender = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../config/prisma"));
const createSender = async (req, res) => {
    console.log("BODY RECEIVED:", req.body);
    try {
        const { userId, name, smtpEmail, smtpHost, smtpPort, smtpUser, smtpPassword, } = req.body;
        const sender = await prisma_1.default.sender.create({
            data: {
                userId,
                name,
                smtpEmail,
                smtpHost,
                smtpPort,
                smtpUser,
                smtpPassword,
            },
        });
        return res.status(201).json(sender);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to create sender",
        });
    }
};
exports.createSender = createSender;
const getSenders = async (req, res) => {
    const senders = await prisma_1.default.sender.findMany();
    console.log(senders);
    return res.json(senders);
};
exports.getSenders = getSenders;
const deleteSender = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.sender.delete({
            where: {
                id,
            },
        });
        return res.json({
            message: "Sender deleted",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to delete sender",
        });
    }
};
exports.deleteSender = deleteSender;
//# sourceMappingURL=sender.controller.js.map