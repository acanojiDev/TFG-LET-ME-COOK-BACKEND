// src/modules/auth/graphql/typeDefs.ts
export const typeDefs = `#graphql
  type AuthPayload {
    token: String!
    user: User!
    personProfile: PersonProfile!
  }

  type SyncUserPayload {
    success: Boolean!
    message: String!
    user: User!
    personProfile: PersonProfile!
  }

  extend type Mutation {
    # Registrar usuario nuevo
    # Email + Password -> Supabase Auth
    # Username, Bio, FullName, PhotoUrl, Location, BirthDate -> person_profiles
    register(
      email: String!
      password: String!
      username: String!
      fullName: String
      bio: String
      photoUrl: String
      location: String
      birthDate: DateTime!
    ): AuthPayload!

    # Login en Supabase (solo email + password)
    login(
      email: String!
      password: String!
    ): AuthPayload!

    # Sincronizar usuario después de login/signup desde frontend
    # El frontend hace login en Supabase y luego llama esto con los datos de person_profiles
    syncUser(
      username: String!
      fullName: String
      bio: String
      photoUrl: String
      location: String
      birthDate: DateTime!
    ): SyncUserPayload!

    # Logout
    logout: Boolean!
  }
`;
