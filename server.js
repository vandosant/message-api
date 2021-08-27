const { ApolloServer, gql } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getUser = async (id) => await prisma.user.findUnique({ where: { id } });
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

const typeDefs = gql`
  type User {
    id: ID
    username: String
    writtenMessages: [Message]
    receivedMessages: [Message]
  }

  type Message {
    to: User
    from: User
    body: String
  }

  type Query {
    messages(from: String): [Message]
  }

  type Mutation {
    sendMessage(to: String!, body: String!): Message!
  }
`;

const resolvers = {
  Query: {
    messages: (_parent, { from }, { user }) => {
      if (from) {
        return getMessages({ from: { username: from }, toId: user.id });
      } else {
        return getMessages({ toId: user.id });
      }
    },
  },
  Mutation: {
    sendMessage: async (_, { body, to }, { user }) => {
      const { id: toId } = await getUserWhere({ username: to });
      return await createMessage({ body, fromId: user.id, toId });
    },
  },
};

const context = async ({ req = {} }) => ({
  db: prisma,
  user: await getUser(req.headers.userId),
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

module.exports = { server, context, resolvers, typeDefs };
