export const typeDefs = `#graphql
  enum PostType {
    PHOTO
    VIDEO
    TEXT
    RECIPE
  }

  enum PostCategory {
    TRENDING
    ITALIAN
    MEXICAN
    JAPANESE
    CHINESE
    DESSERTS
    VEGAN
    QUICK_EASY
    BURGER
    SEAFOOD
    COCKTAILS
    BREAKFAST
    LUNCH
    DINNER
    SNACKS
    HEALTHY
    COMFORT_FOOD
    STREET_FOOD
  }

  enum DifficultyLevel {
    EASY
    MEDIUM
    HARD
  }

  enum PostOrderByField {
    CREATED_AT
    LIKE_COUNT
    COMMENT_COUNT
    VIEW_COUNT
    TRENDING_SCORE
  }

  input PostOrderByInput {
    field: PostOrderByField!
    direction: OrderDirection!
  }

  type Post {
    id: ID!
    user: User!
    postType: PostType!
    title: String
    description: String
    categories: [PostCategory!]!
    createdAt: DateTime!
    updatedAt: DateTime!

    # Media
    media: [PostMedia!]!

    # Receta (si aplica)
    recipe: Recipe

    # Interacciones
    likeCount: Int!
    commentCount: Int!
    saveCount: Int!
    viewCount: Int!

    # Estado del usuario actual
    isLikedByCurrentUser: Boolean!
    isSavedByCurrentUser: Boolean!
    isViewedByCurrentUser: Boolean!

    # Relaciones - Defining locally but User is external
    likes(first: Int): [User!]!
    comments(first: Int, after: String): CommentConnection!
  }

  type PostMedia {
    id: ID!
    postId: ID!
    mediaUrl: String!
    mediaType: String!
    position: Int!
  }

  type Recipe {
    id: ID!
    postId: ID!
    name: String!
    description: String
    steps: String!
    difficulty: DifficultyLevel
    timeRequired: Int # minutos
    estimatedCost: Decimal
    servings: Int

    ingredients: [RecipeIngredient!]!

    # Filtrado de alergias
    hasSafeIngredientsFor(userId: ID!): Boolean!
  }

  type RecipeIngredient {
    ingredient: Ingredient!
    quantity: Decimal!
    notes: String
  }

  type Ingredient {
    id: ID!
    name: String!
    unit: String!
    allergens: [Allergen!]!
  }

  type Comment {
    id: ID!
    user: User!
    post: Post!
    text: String!
    createdAt: DateTime!
  }

  type PostConnection {
    edges: [PostEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type PostEdge {
    node: Post!
    cursor: String!
  }

  type CommentConnection {
    edges: [CommentEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type CommentEdge {
    node: Comment!
    cursor: String!
  }

  input CreatePostInput {
    postType: PostType!
    title: String
    description: String
    categories: [PostCategory!]!
    mediaUrls: [String!]
    recipe: CreateRecipeInput
  }

  input CreateRecipeInput {
    name: String!
    description: String
    steps: String!
    difficulty: DifficultyLevel
    timeRequired: Int
    estimatedCost: Decimal
    servings: Int
    ingredients: [RecipeIngredientInput!]!
  }

  input RecipeIngredientInput {
    ingredientId: ID!
    quantity: Decimal!
    notes: String
  }

  # Extend User to add posts
  extend type User {
    posts(
      first: Int
      after: String
      orderBy: PostOrderByInput
    ): PostConnection!
  }

  # Extend Allergen here to add back-reference if needed? No, prompt didn't show Allergen.affectedIngredients but logically it exists.
  # Prompt: type Allergen { affectedIngredients: [Ingredient!]! }
  # Since Ingredient is here, we should extend Allergen.
  extend type Allergen {
    affectedIngredients: [Ingredient!]!
  }

  extend type Query {
    homeFeed(first: Int = 20, after: String): PostConnection!
    explorePosts(categories: [PostCategory!], first: Int = 20, after: String): PostConnection!
    post(id: ID!): Post
    searchPosts(query: String!, first: Int = 20): [Post!]!
  }

  extend type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: CreatePostInput!): Post!
    deletePost(id: ID!): Boolean!

    likePost(postId: ID!): Post!
    unlikePost(postId: ID!): Post!

    savePost(postId: ID!): Post!
    unsavePost(postId: ID!): Post!

    viewPost(postId: ID!): Post!

    commentOnPost(postId: ID!, text: String!): Comment!
    deleteComment(commentId: ID!): Boolean!
  }

  extend type Subscription {
     newPostFromFollowing: Post!
     newCommentOnPost(postId: ID!): Comment!
  }
`;
