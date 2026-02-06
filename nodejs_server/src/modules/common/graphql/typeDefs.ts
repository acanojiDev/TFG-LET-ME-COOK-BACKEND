
export const typeDefs = `#graphql
  scalar DateTime
  scalar Decimal

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  enum OrderDirection {
    ASC
    DESC
  }

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;
