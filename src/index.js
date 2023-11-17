// @ts-nocheck
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import "dotenv/config";
import cors from "cors";
import express from "express";
import http from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { typesMerged } from "./typeDefs/index.js";
import { resolvers } from "./resolvers/index.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { stitchSchemas } from "@graphql-tools/stitch";
import { assetSubschema } from "./utils/sitching.js";
import dataSources from "./dataSources/index.js";
import Keyv from "keyv";
import sqlPlugin from "./plugins/sql-plugin.js";
import redisPlugin from "./plugins/redis-plugin.js";
import { MyKeyvAdapter } from "./plugins/key-adapter.js";
import { ApolloServerPluginUsageReporting } from "@apollo/server/plugin/usageReporting";

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);
// TODO: disabled MykeyvAdapter for prod
const cache = new MyKeyvAdapter(new Keyv("redis://localhost:6379"));
const schemaCore = makeExecutableSchema({
  typeDefs: typesMerged,
});

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer({
  schema: stitchSchemas({
    subschemas: [
      {
        schema: schemaCore,
      },
      assetSubschema,
    ],
    resolvers: [resolvers],
    resolverValidationOptions: { requireResolversForResolveType: false },
  }),
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    sqlPlugin,
    redisPlugin,
    ApolloServerPluginUsageReporting({
      sendVariableValues: { all: true },
      sendHeaders: { all: true },
      sendReportsImmediately: true,
      sendErrors: { unmodified: true },
    }),
  ],
  cache,
});
// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  "/",
  cors(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => {
      await Promise.all(
        Object.values(dataSources).map(async (dataSource) => {
          if (dataSource.initialize) await dataSource.initialize({ cache });
        })
      );

      return {
        dataSources,
      };
    },
  })
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/`);
