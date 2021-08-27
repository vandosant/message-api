const assert = require("assert");
const { ApolloServer, gql } = require("apollo-server");

const { context, resolvers, typeDefs } = require("../server.js");

const GET_MESSAGES = gql`
  query GetMessages {
    messages {
      to {
        username
      }
      from {
        username
      }
      body
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($to: String!, $body: String!) {
    sendMessage(to: $to, body: $body) {
      to {
        username
      }
      from {
        username
      }
      body
    }
  }
`;

describe("with userId header", async () => {
  let db;

  beforeEach(async () => {
    const ctx = await context({ req: { headers: { userId: 1 } } });
    db = ctx.db;
    await db.message.deleteMany();
    await db.user.deleteMany();
  });

  it("fetches messages", async () => {
    const user = await db.user.create({ data: { username: "a" } });

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: { db, user },
    });

    const res = await server.executeOperation({
      query: GET_MESSAGES,
    });
    assert.equal(res.data.messages.length, 0);
  });

  it("sends messages", async () => {
    const user = await db.user.create({
      data: { username: "a" },
    });
    const toUser = await db.user.create({
      data: { username: "b" },
    });

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: { db, user },
    });

    const res = await server.executeOperation({
      query: SEND_MESSAGE,
      variables: { to: toUser.username, body: "hello!" },
    });
    assert.deepEqual(res.data.sendMessage, {
      from: { username: "a" },
      to: { username: "b" },
      body: "hello!",
    });
  });
});
