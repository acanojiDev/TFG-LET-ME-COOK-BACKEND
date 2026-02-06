
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs, resolvers } from './schema';
import { createContext, Context } from './context';

let apolloServer: ApolloServer<Context> | null = null;

export async function createApolloServer() {
	if (apolloServer) {
		return apolloServer;
	}

	apolloServer = new ApolloServer<Context>({
		typeDefs,
		resolvers,
		introspection: true,
	});

	await apolloServer.start();
	return apolloServer;
}

export function getApolloMiddleware(server: ApolloServer<Context>) {
	return expressMiddleware(server, {
		context: createContext
	});
}
