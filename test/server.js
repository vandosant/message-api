const assert = require("assert");
const { ApolloServer, gql } = require("apollo-server");

const { context, resolvers, typeDefs } = require("../server.js");

const GET_MESSAGES = gql`
  query GetMessages($from: String) {
    messages(from: $from) {
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

describe("with userid header", async () => {
  let db;

  beforeEach(async () => {
    const ctx = await context({ req: { headers: { userid: 1 } } });
    db = ctx.db;
    await db.message.deleteMany();
    await db.user.deleteMany();
    return db;
  });

  afterEach(async () => db.$disconnect());

  it("fetches messages", async () => {
    const fromUser = await db.user.create({
      data: { username: "b" },
    });
    const user = await db.user.create({
      data: {
        username: "a",
        receivedMessages: {
          create: Array(101)
            .fill(0)
            .map(() => ({
              body: "hello!",
              fromId: fromUser.id,
            })),
        },
      },
    });

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: { db, user },
    });

    const res = await server.executeOperation({
      query: GET_MESSAGES,
    });

    assert.equal(res.data.messages.length, 100);
  });

  it("filters messages from a user", async () => {
    const user = await db.user.create({
      data: {
        username: "a",
        receivedMessages: {
          create: [
            {
              body: "ahoy!",
              from: { create: { username: "b" } },
            },
            {
              body: "hello!",
              from: { create: { username: "c" } },
            },
          ],
        },
      },
    });

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: { db, user },
    });

    const res = await server.executeOperation({
      query: GET_MESSAGES,
      variables: { from: "c" },
    });

    assert.deepEqual(res.data.messages, [
      { body: "hello!", to: { username: "a" }, from: { username: "c" } },
    ]);
  });

  it("orders by latest message", async () => {
    const user = await db.user.create({
      data: {
        username: "a",
      },
    });
    const fromUser = await db.user.create({
      data: {
        username: "b",
      },
    });
    for (let i = 0; i < 10; i++) {
      await db.message.create({
        data: {
          body: "hello!",
          to: { connect: { id: user.id } },
          from: { connect: { id: fromUser.id } },
        },
      });
    }
    await db.message.create({
      data: {
        body: "i'm back!",
        to: { connect: { id: user.id } },
        from: { connect: { id: fromUser.id } },
      },
    });

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: { db, user },
    });

    const res = await server.executeOperation({
      query: GET_MESSAGES,
    });

    assert.deepEqual(res.data.messages[0].body, "i'm back!");
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
