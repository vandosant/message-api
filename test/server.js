const assert = require("assert");
const { ApolloServer, gql } = require("apollo-server");

const { context, resolvers, typeDefs } = require("../server.js");

const GET_MESSAGES = gql`
  query GetMessages {
    messages {
      to
      from
      body
    }
  }
`;

describe("with userId header", async () => {
  let db;

  beforeEach(async () => {
    const ctx = await context({ req: { headers: { userId: 1 } } });
    db = ctx.db;
    await db.user.deleteMany();
  });

  it("fetches messages", async () => {
    const user = await db.user.create({ data: { email: "a@a.com" } });

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: { db, user },
    });

    const res = await server.executeOperation({
      query: GET_MESSAGES,
      variables: { id: 1 },
    });
    assert.equal(res.data.messages.length, 0);
  });
});
