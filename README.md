

# Overview
## Messaging API
An api that supports a web-application to enable two users to send short text messages to each other, like Facebook Messages app or Google Chat
### Why GraphQL?
Websocket support is simple to setup, which would be an ideal delivery method for messages
### Why Node?
GraphQL support is the best, especially when it comes to DB and ORM tooling
### Why Apollo?
It's the only GraphQL server library I have shipped to production with, and since this is the first time I am using the Prisma ORM, I didn't want to add another unknown. With more time, I would consider a service like Hasura, or graphql-yoga, a more minimal Node library
### Why Postgres?
I think the relational aspect of messages (tracking senders/recipients) was reason enough. With native json/jsonb support, messages can expand their capabilities to include more in-depth functionality over time. I considered MongoDB briefly, but Prisma only supports it as a preview feature, so I stopped there
### Attributions
[Docker setup from BretFisher](https://github.com/BretFisher/node-docker-good-defaults)

# Setup
### Local setup
1. Start the server: `docker-compose up`
2. Navigate to http://localhost:4000 in a browser
3. In [Apollo Studio](https://studio.apollographql.com/sandbox/explorer?overlay=connection-settings), add a `userid` header with a value of an existing user from the database (the server creates a couple on startup and logs the user ids)
5. Send a message:
```graphql
mutation SendMessage {
  sendMessage(to: "messagee", body: "hello!") {
    body
  }
}
```
4. Query for messages, optionally filtering by user:
```graphql
query Query {
  messages(from: "messager") {
    to { username }
    body
  }
}
```
### Testing
`docker-compose run --rm api npm run test`

# ToDos
- Handle null userId header with a useful error explanation
- Setup a GraphQL subscription to allow streaming of messages
- Configure schema introspection to the playground can infer queries and mutations
