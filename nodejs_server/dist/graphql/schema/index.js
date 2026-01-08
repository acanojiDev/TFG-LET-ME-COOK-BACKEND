"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const types_1 = require("./types");
const queries_1 = require("./queries");
const mutations_1 = require("./mutations");
/**
 * Schema base de GraphQL para el módulo de Posts
 * Combina tipos, queries y mutations
 */
exports.postSchema = [types_1.typeDefs, queries_1.queryDefs, mutations_1.mutationDefs];
//# sourceMappingURL=index.js.map