
export const typeDefs = `#graphql
  enum StoryType {
    PHOTO
    VIDEO
  }

  type Story {
    id: ID!
    user: User!
    storyType: StoryType!
    mediaUrl: String!
    createdAt: DateTime!
    expiresAt: DateTime!

    # Estado
    isActive: Boolean!

    # Visualizaciones
    viewCount: Int!
    isViewedByCurrentUser: Boolean!
    viewers: [User!]!
  }

  input CreateStoryInput {
    storyType: StoryType!
    mediaUrl: String!
  }

  extend type User {
    stories(onlyActive: Boolean): [Story!]!
  }

  extend type Query {
    homeStories: [Story!]!
  }

  extend type Mutation {
    createStory(input: CreateStoryInput!): Story!
    deleteStory(id: ID!): Boolean!
    viewStory(storyId: ID!): Story!
  }

  extend type Subscription {
    newStoryFromFollowing: Story!
  }
`;
