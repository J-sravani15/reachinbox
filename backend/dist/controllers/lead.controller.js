"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeads = exports.createLead = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createLead = async (req, res) => {
    try {
        const { campaignId, email, firstName, company, } = req.body;
        const lead = await prisma_1.default.lead.create({
            data: {
                campaignId,
                email,
                firstName,
                company,
            },
        });
        return res.status(201).json(lead);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to create lead",
        });
    }
};
exports.createLead = createLead;
const getLeads = async (req, res) => {
    try {
        const leads = await prisma_1.default.lead.findMany();
        return res.json(leads);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch leads",
        });
    }
};
exports.getLeads = getLeads;
//# sourceMappingURL=lead.controller.js.map