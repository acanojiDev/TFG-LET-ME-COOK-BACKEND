import { ApolloServer } from '@apollo/server';
import { Context } from './context';
export declare function createApolloServer(): Promise<ApolloServer<Context>>;
export declare function getApolloMiddleware(server: ApolloServer<Context>): import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=index.d.ts.map