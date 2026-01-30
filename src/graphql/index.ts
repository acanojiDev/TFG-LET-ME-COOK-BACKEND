import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { postSchema } from './schema';
import { postResolvers } from './resolvers/post.resolvers';

/**
 * Configuración de Apollo Server
 * Une los schemas y resolvers de GraphQL
 */
let apolloServer: ApolloServer | null = null;

/**
 * Inicializa y configura Apollo Server con los schemas y resolvers
 */
export async function createApolloServer() {
	if (apolloServer) {
		return apolloServer;
	}

	apolloServer = new ApolloServer({
		typeDefs: postSchema,
		resolvers: postResolvers,
		introspection: true, // Habilita GraphQL Playground en desarrollo
	});

	await apolloServer.start();
	return apolloServer;
}

/**
 * Obtiene el middleware de Express para Apollo Server
 * @param apolloServer - Instancia de Apollo Server
 * @returns Middleware de Express para GraphQL
 */
export function getApolloMiddleware(apolloServer: ApolloServer) {
	return expressMiddleware(apolloServer, {
		context: async ({ req }) => {
			// Aquí puedes agregar información del contexto (usuario autenticado, etc.)
			// Por ahora, pasamos el request completo
			return {
				req,
				// Puedes extraer el user_id del token JWT aquí si es necesario
				// user_id: req.headers.authorization ? extractUserId(req.headers.authorization) : null,
			};
		},
	});
}
