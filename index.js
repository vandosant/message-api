const { server, db } = require("./server");

server
  .listen()
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  })
  .then(async () => {
    const sender = await db.client.user.upsert({
      where: { username: "messager" },
      update: { username: "messager" },
      create: { username: "messager" },
    });
    const sendee = await db.client.user.upsert({
      where: { username: "messagee" },
      update: { username: "messagee" },
      create: { username: "messagee" },
    });
    console.log(`Configured a user to send messages with id: ${sender.id}`);
    console.log(`Configured a user to send messages to with id: ${sendee.id}`);
  })
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await db.client.$disconnect();
  });
