"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApolloServer = createApolloServer;
exports.getApolloMiddleware = getApolloMiddleware;
const server_1 = require("@apollo/server");
const default_1 = require("@apollo/server/plugin/landingPage/default");
const express5_1 = require("@as-integrations/express5");
const graphql_1 = require("graphql");
const graphql_query_complexity_1 = require("graphql-query-complexity");
const schema_1 = require("./schema");
const context_1 = require("./context");
const MAX_COMPLEXITY = 200;
const MAX_DEPTH = 7;
// Regla de validacion de profundidad maxima de queries
function depthLimitRule(maxDepth) {
    return (context) => ({
        Field: {
            enter(_node, _key, _parent, path) {
                const depth = path.filter((p) => p === 'selectionSet').length;
                if (depth > maxDepth) {
                    context.reportError(new graphql_1.GraphQLError(`Query depth ${depth} exceeds maximum allowed depth of ${maxDepth}`, { extensions: { code: 'QUERY_TOO_DEEP' } }));
                }
            }
        }
    });
}
function buildComplexityPlugin() {
    return {
        requestDidStart: async () => ({
            didResolveOperation: async ({ request, document, schema, }) => {
                const complexity = (0, graphql_query_complexity_1.getComplexity)({
                    schema,
                    operationName: request.operationName,
                    query: document,
                    variables: request.variables,
                    estimators: [
                        (0, graphql_query_complexity_1.fieldExtensionsEstimator)(),
                        (0, graphql_query_complexity_1.simpleEstimator)({ defaultComplexity: 1 }),
                    ],
                });
                if (complexity > MAX_COMPLEXITY) {
                    throw new Error(`Query complexity ${complexity} exceeds maximum allowed complexity of ${MAX_COMPLEXITY}`);
                }
            },
        }),
    };
}
let apolloServer = null;
async function createApolloServer() {
    if (apolloServer) {
        return apolloServer;
    }
    apolloServer = new server_1.ApolloServer({
        typeDefs: schema_1.typeDefs,
        resolvers: schema_1.resolvers,
        introspection: process.env.NODE_ENV !== 'production',
        validationRules: [depthLimitRule(MAX_DEPTH)],
        plugins: [
            buildComplexityPlugin(),
            process.env.NODE_ENV === 'production'
                ? (0, default_1.ApolloServerPluginLandingPageProductionDefault)()
                : (0, default_1.ApolloServerPluginLandingPageLocalDefault)({ embed: true })
        ]
    });
    await apolloServer.start();
    return apolloServer;
}
function getApolloMiddleware(server) {
    return (0, express5_1.expressMiddleware)(server, {
        context: context_1.createContext
    });
}
//# sourceMappingURL=index.js.map