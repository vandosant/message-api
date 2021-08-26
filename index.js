const { ApolloServer, gql } = require("apollo-server");

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

const messages = [
  {
    to: "Paul",
    from: "Kate",
    body: "yo!",
  },
  {
    to: "Kate",
    from: "Paul",
    body: "hola!",
  },
];

const resolvers = {
  Query: {
    messages: () => messages,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

module.exports = { resolvers, typeDefs };
