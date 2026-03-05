
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { expressMiddleware } from '@as-integrations/express5';
import { GraphQLSchema, GraphQLError, ValidationContext, FieldNode } from 'graphql';
import {
	fieldExtensionsEstimator,
	getComplexity,
	simpleEstimator
} from 'graphql-query-complexity';
import { typeDefs, resolvers } from './schema';
import { createContext, Context } from './context';

const MAX_COMPLEXITY = 200;
const MAX_DEPTH = 7;

// Regla de validacion de profundidad maxima de queries
function depthLimitRule(maxDepth: number) {
	return (context: ValidationContext) => ({
		Field: {
			enter(_node: FieldNode, _key: unknown, _parent: unknown, path: readonly (string | number)[]) {
				const depth = path.filter((p) => p === 'selectionSet').length;
				if (depth > maxDepth) {
					context.reportError(
						new GraphQLError(
							`Query depth ${depth} exceeds maximum allowed depth of ${maxDepth}`,
							{ extensions: { code: 'QUERY_TOO_DEEP' } }
						)
					);
				}
			}
		}
	});
}

function buildComplexityPlugin() {
	return {
		requestDidStart: async () => ({
			didResolveOperation: async ({
				request,
				document,
				schema,
			}: {
				request: any;
				document: any;
				schema: GraphQLSchema;
			}) => {
				const complexity = getComplexity({
					schema,
					operationName: request.operationName,
					query: document,
					variables: request.variables,
					estimators: [
						fieldExtensionsEstimator(),
						simpleEstimator({ defaultComplexity: 1 }),
					],
				});

				if (complexity > MAX_COMPLEXITY) {
					throw new Error(
						`Query complexity ${complexity} exceeds maximum allowed complexity of ${MAX_COMPLEXITY}`
					);
				}
			},
		}),
	};
}

let apolloServer: ApolloServer<Context> | null = null;

export async function createApolloServer() {
	if (apolloServer) {
		return apolloServer;
	}

	apolloServer = new ApolloServer<Context>({
		typeDefs,
		resolvers,
		introspection: true,
		validationRules: [depthLimitRule(MAX_DEPTH)],
		plugins: [
			buildComplexityPlugin(),
			process.env.NODE_ENV === 'production'
				? ApolloServerPluginLandingPageProductionDefault()
				: ApolloServerPluginLandingPageLocalDefault({ embed: true })
		]
	});

	await apolloServer.start();
	return apolloServer;
}

export function getApolloMiddleware(server: ApolloServer<Context>) {
	return expressMiddleware(server, {
		context: createContext
	});
}
