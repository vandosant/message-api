const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getUser = async (id) =>
  await prisma.user.findUnique({ where: { id: Number(id) } });
const getUserWhere = async (where) => await prisma.user.findUnique({ where });
const getMessages = async (where) =>
  await prisma.message.findMany({
    where,
    include: { from: true, to: true },
    take: 100,
    orderBy: { createdAt: "desc" },
  });
const createMessage = async ({ body, fromId, toId }) =>
  await prisma.message.create({
    data: { body, fromId, toId },
    include: { from: true, to: true },
  });

module.exports = {
  db: { client: prisma, getUser, getUserWhere, getMessages, createMessage },
};
