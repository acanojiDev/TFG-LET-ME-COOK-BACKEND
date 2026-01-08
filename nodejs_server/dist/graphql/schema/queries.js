"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryDefs = void 0;
exports.queryDefs = `
	extend type Query {
		# Obtener feed de posts con paginación
		posts(limit: Int, user_id: ID!, cursor: String): PostsConnection!

		# Obtener un post por ID
		post(id: ID!, user_id: ID): Post

		# Obtener posts de un usuario específicos
		userPosts(target_user_id: ID!, user_id: ID!): [Post!]!

		# Obtener posts guardados por un usuario
		savedPosts(user_id: ID!): [Post!]!

		# PANTALLA INICIO: Posts con autor completo (imagen, username), descripción, tiempo_estimado, dinero, likes, comentarios y favoritos
		homePosts(user_id: ID!, limit: Int, cursor: String): PostsConnection!

		# PANTALLA PLACE: Place con nombre, ubicación, especialidad, tipo, likes, comentarios, reservas y etiquetas
		place(id: ID!): Place

		# PANTALLA EXPLORAR: Posts aleatorios ordenados por fecha más reciente (para infinite scroll)
		explorePosts(user_id: ID!, limit: Int, cursor: String): PostsConnection!

		# PANTALLA PERFIL: Información del perfil del usuario (posts, seguidores, seguidos)
		userProfile(user_id: ID!, target_user_id: ID!): UserProfile!
	}
`;
//# sourceMappingURL=queries.js.map