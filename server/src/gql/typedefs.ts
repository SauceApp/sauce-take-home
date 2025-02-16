/**
 * GraphQL type definitions
 */
const typeDefs = /* GraphQL */ `
  type Query {
    feedback(id: Int!): Feedback
    feedbacks(page: Int!, per_page: Int!): FeedbackPage!
    highlightcount: Int!
    highlights(page: Int!, per_page: Int!): HighlightPage!
  }
  
  type Mutation {
    createFeedback(text: String!): Feedback!
  }

  type Feedback {
    id: Int!
    text: String!
    highlights: [Highlight!]
  }

  type Highlight {
    id: Int!
    quote: String!
    summary: String!
    feedback: String!
  }

  type FeedbackPage {
    values: [Feedback!]!
    count: Int!
  }

  type HighlightPage {
    values: [Highlight!]!
    count: Int!
  }
`;

export default typeDefs;