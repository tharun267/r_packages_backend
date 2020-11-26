const { ApolloServer, gql } = require('apollo-server');
const { typeDefs } = require("./typeDefs");
const { resolvers } = require("./resolvers");
const { main } = require('./rPackagesCron');
const CronJob = require('cron').CronJob;

const job = new CronJob({
  cronTime: '00 00 00 * * * ',
  onTick: function () {
    //Your code that is to be executed on every midnight
    main(0, 5);
  },
  start: true,
  runOnInit: true
});

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
