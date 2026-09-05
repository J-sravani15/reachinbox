"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSender = exports.getSenders = exports.createSender = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createSender = async (data) => {
    return prisma_1.default.sender.create({
        data,
    });
};
exports.createSender = createSender;
const getSenders = async (userId) => {
    return prisma_1.default.sender.findMany({
        where: { userId },
    });
};
exports.getSenders = getSenders;
const deleteSender = async (id) => {
    return prisma_1.default.sender.delete({
        where: { id },
    });
};
exports.deleteSender = deleteSender;
//# sourceMappingURL=sender.service.js.map