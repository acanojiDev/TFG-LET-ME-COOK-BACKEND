"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutationDefs = void 0;
exports.mutationDefs = `
	extend type Mutation {
		# Crear un nuevo post
		createPost(input: CreatePostInput!): Post!

		# Actualizar un post existente
		updatePost(id: ID!, input: UpdatePostInput!): Post!

		# Eliminar un post
		deletePost(id: ID!): Boolean!

		# Guardar un post (agregar a favoritos)
		savePost(user_id: ID!, post_id: ID!): Boolean!

		# Quitar un post de favoritos
		unsavePost(user_id: ID!, post_id: ID!): Boolean!
	}
`;
//# sourceMappingURL=mutations.js.map