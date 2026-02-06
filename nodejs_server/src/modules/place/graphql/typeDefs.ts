
export const typeDefs = `#graphql
  enum PlaceFilter {
    BURGER
    SEAFOOD
    ITALIAN
    MEXICAN
    CHINESE
    JAPANESE
    COCKTAIL
    WINE
    HAPPY_HOUR
    NIGHTLIFE
  }

  type Place {
    id: ID!
    name: String!
    mediaUrl: String
    address: String!
    location: String!
    description: String
    placeType: UserType!
    filters: [PlaceFilter!]!
    specialty: String
    phone: String
    website: String
    isOpen: Boolean!

    # Rating calculado
    averageRating: Float
    reviewCount: Int!

    # Relaciones
    reviews(first: Int, after: String): PlaceReviewConnection!
  }

  type PlaceReview {
    id: ID!
    user: User!
    place: Place!
    rating: Decimal!
    comment: String
    photoUrl: String
    createdAt: DateTime!
  }

  type PlaceReviewConnection {
    edges: [PlaceReviewEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type PlaceReviewEdge {
    node: PlaceReview!
    cursor: String!
  }

  extend type Query {
    places(
      placeType: UserType!
      filters: [PlaceFilter!]
      nearLocation: String
      first: Int = 20
      after: String
    ): [Place!]!

    place(id: ID!): Place

    searchPlaces(query: String!, first: Int = 20): [Place!]!
  }

  extend type Mutation {
    reviewPlace(
      placeId: ID!
      rating: Decimal!
      comment: String
      photoUrl: String
    ): PlaceReview!
  }
`;
