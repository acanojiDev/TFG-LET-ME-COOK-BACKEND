import { typeDefs } from './types';
import { queryDefs } from './queries';
import { mutationDefs } from './mutations';

/**
 * Schema base de GraphQL para el módulo de Posts
 * Combina tipos, queries y mutations
 */
export const postSchema = [typeDefs, queryDefs, mutationDefs];

