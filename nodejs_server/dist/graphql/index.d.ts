import { ApolloServer } from '@apollo/server';
/**
 * Inicializa y configura Apollo Server con los schemas y resolvers
 */
export declare function createApolloServer(): Promise<ApolloServer<import("@apollo/server").BaseContext>>;
/**
 * Obtiene el middleware de Express para Apollo Server
 * @param apolloServer - Instancia de Apollo Server
 * @returns Middleware de Express para GraphQL
 */
export declare function getApolloMiddleware(apolloServer: ApolloServer): import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=index.d.ts.map