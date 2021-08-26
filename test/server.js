const assert = require("assert");
const { ApolloServer, gql } = require("apollo-server");

const { resolvers, typeDefs } = require("../index.js");

const GET_MESSAGES = gql`
  query GetMessages {
    messages {
      to
      from
      body
    }
  }
`;

it("fetches messages", async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ user: { id: 1, username: "aaa" } }),
  });

  const res = await server.executeOperation({
    query: GET_MESSAGES,
    variables: { id: 1 },
  });
  assert.equal(res.data.messages.length, 2);
});
