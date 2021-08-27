const { server, db } = require("./server");

server
  .listen()
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  })
  .then(async () => {
    const user = await db.client.user.upsert({
      where: { username: "alice" },
      update: { username: "alice" },
      create: { username: "alice" },
    });
    console.log(`Configured a user with id: ${user.id}`);
  })
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await db.client.$disconnect();
  });
