export const typeDefs = `
	# Tipo User básico (para relaciones con Post)
	type User {
		id: ID!
		username: String!
		photo_url: String
	}

	# Tipo para contar likes y comentarios
	type PostCount {
		comments: Int!
		likes: Int!
	}

	# Tipo Post principal
	type Post {
		id: ID!
		user_id: ID!
		type: String!
		content: String
		media_url: String
		created_at: String
		updated_at: String
		user: User
		likesCount: Int
		commentsCount: Int
		savedCount: Int
		is_liked: Boolean
		# Campos de recipe (si el post es de tipo recipe)
		description: String
		time_required: Int
		money: Float
	}

	# Tipo Place para lugares (bares, restaurantes, etc.)
	type Place {
		id: ID!
		name: String!
		address: String!
		description: String
		tags: [String!]!
		rating: Float
		open: Boolean
		type: String
		likesCount: Int
		commentsCount: Int
		reservationsCount: Int
	}

	# Tipo UserProfile para la pantalla de perfil
	type UserProfile {
		id: ID!
		username: String!
		photo_url: String
		bio: String
		location: String
		postsCount: Int!
		posts: [Post!]!
		followersCount: Int!
		followingCount: Int!
	}

	# Tipo para la respuesta paginada de posts
	type PostsConnection {
		data: [Post!]!
		next_cursor: String
		has_more: Boolean!
	}

	# Input para crear un post
	input CreatePostInput {
		user_id: ID!
		type: String!
		content: String
		media_url: String
	}

	# Input para actualizar un post
	input UpdatePostInput {
		content: String
		media_url: String
	}

	# Tipo base Query (requerido por GraphQL)
	type Query {
		_empty: String
	}

	# Tipo base Mutation (requerido por GraphQL)
	type Mutation {
		_empty: String
	}
`;

