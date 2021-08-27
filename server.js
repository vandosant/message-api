const { ApolloServer, gql } = require("apollo-server");
const { db } = require("./db");

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
        return db.getMessages({ from: { username: from }, toId: user.id });
      } else {
        return db.getMessages({ toId: user.id });
      }
    },
  },
  Mutation: {
    sendMessage: async (_, { body, to }, { user }) => {
      const { id: toId } = await db.getUserWhere({ username: to });
      return await db.createMessage({ body, fromId: user.id, toId });
    },
  },
};

const context = async ({ req = {} }) => ({
  db: db.client,
  user: await db.getUser(req.headers.userid),
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

module.exports = { server, db, context, resolvers, typeDefs };
