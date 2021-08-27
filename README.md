

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
`docker-compose up`

### Testing
`docker compose run --rm api npm run test`
