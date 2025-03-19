import { ApolloServer } from '@apollo/server';
import config from './config';
import { schema } from './apollo';
import mongoose from 'mongoose'
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import formatError from './errors';
import context from './context';

const app = express();
const httpServer = http.createServer(app);


(async () => {
    const server = new ApolloServer({
        schema: schema,
        status400ForVariableCoercionErrors: process.env.NODE_ENV === 'development',
        formatError: formatError,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
        ]
    });

    await mongoose.connect(config.db.uri, {
        dbName: config.db.database,
    })
    console.log(`🚀  Database ready`);
    await server.start();
    app.use(cors());
    app.use(express.json({ limit: "5mb" }));
    app.use(express.urlencoded({ extended: true }));

    app.use("/graphql", expressMiddleware(server, {
        context
    }));
    await new Promise<void>((resolve) =>
        httpServer.listen({ port: config.port }, resolve)
    );
    console.log(`🚀  Server ready at: http://localhost${config.port}/graphql`);
})();
