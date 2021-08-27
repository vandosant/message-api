const { ApolloServer, gql } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getUser = async (id) => await prisma.user.findUnique({ where: { id } });
const getMessages = async (toId) =>
  await prisma.message.findMany({ where: { toId } });

const typeDefs = gql`
  type Message {
    to: String
    from: String
    body: String
  }

  type Query {
    messages: [Message]
  }
`;

const resolvers = {
  Query: {
    messages: (_parent, _args, { user }) => getMessages(user.id),
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
