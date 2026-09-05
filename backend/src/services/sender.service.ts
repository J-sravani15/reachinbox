import prisma from "../config/prisma";

export const createSender = async (data: {
  userId: string;
  name: string;
  smtpEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
}) => {
  return prisma.sender.create({
    data,
  });
};

export const getSenders = async (userId: string) => {
  return prisma.sender.findMany({
    where: { userId },
  });
};

export const deleteSender = async (id: string) => {
  return prisma.sender.delete({
    where: { id },
  });
};