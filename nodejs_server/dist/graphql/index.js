"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApolloServer = createApolloServer;
exports.getApolloMiddleware = getApolloMiddleware;
const server_1 = require("@apollo/server");
const express5_1 = require("@as-integrations/express5");
const schema_1 = require("./schema");
const post_resolvers_1 = require("./resolvers/post.resolvers");
/**
 * Configuración de Apollo Server
 * Une los schemas y resolvers de GraphQL
 */
let apolloServer = null;
/**
 * Inicializa y configura Apollo Server con los schemas y resolvers
 */
async function createApolloServer() {
    if (apolloServer) {
        return apolloServer;
    }
    apolloServer = new server_1.ApolloServer({
        typeDefs: schema_1.postSchema,
        resolvers: post_resolvers_1.postResolvers,
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
function getApolloMiddleware(apolloServer) {
    return (0, express5_1.expressMiddleware)(apolloServer, {
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
//# sourceMappingURL=index.js.map