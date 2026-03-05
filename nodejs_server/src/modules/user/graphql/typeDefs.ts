
export const typeDefs = `#graphql
  enum UserType {
    PERSON
    RESTAURANT
    BAR
  }

  type User {
    id: ID!
    email: String
    userType: UserType!
    createdAt: DateTime!

    # Perfiles polimórficos
    personProfile: PersonProfile
    businessProfile: BusinessProfile

    # Estadísticas
    postCount: Int!
    followerCount: Int!
    followingCount: Int!

    # Relaciones
    followers(first: Int, after: String): UserConnection!
    following(first: Int, after: String): UserConnection!

    # Estado relación con usuario actual
    isFollowedByCurrentUser: Boolean!
    isFollowingCurrentUser: Boolean!
  }

  type PersonProfile {
    userId: ID!
    username: String!
    fullName: String
    photoUrl: String
    bio: String
    location: String
    birthDate: DateTime!
    user: User!
  }

  type BusinessProfile {
    userId: ID!
    businessName: String!
    photoUrl: String
    bio: String
    location: String!
    specialty: String
    phone: String
    website: String
    user: User!
  }

  type Allergen {
    id: ID!
    name: String!
    # affectedIngredients: [Ingredient!]! # Requires Ingredient from Post/Recipe module. Extend later? Or just keep here if Ingredient is common?
    # For now leaving out affectedIngredients or defining a stub/extension.
    # Actually, Ingredient is in Post/Recipe. I should extend Allergen in Post module.
  }

  type Preference {
    id: ID!
    name: String!
  }

  type UserConnection {
    edges: [UserEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type UserEdge {
    node: User!
    cursor: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input PersonProfileInput {
    username: String
    fullName: String
    photoUrl: String
    bio: String
    location: String
    birthDate: DateTime
  }

  input BusinessProfileInput {
    businessName: String
    photoUrl: String
    bio: String
    location: String
    specialty: String
    phone: String
    website: String
  }

  extend type Query {
    me: User
    user(id: ID!): User
    userByUsername(username: String!): User
    searchUsers(query: String!, first: Int = 20): [User!]!

    allergens: [Allergen!]!
    preferences: [Preference!]!
  }

  extend type Mutation {
    register(
      email: String!
      password: String!
      userType: UserType!
      personData: PersonProfileInput
      businessData: BusinessProfileInput
      allergenIds: [ID!]
      preferenceIds: [ID!]
    ): AuthPayload!

    login(email: String!, password: String!): AuthPayload!

    followUser(userId: ID!): User!
    unfollowUser(userId: ID!): User!

    updateProfile(
      personData: PersonProfileInput
      businessData: BusinessProfileInput
    ): User!

    updateAllergies(allergenIds: [ID!]!): User!
    updatePreferences(preferenceIds: [ID!]!): User!
  }
`;
