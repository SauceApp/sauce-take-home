import { gql } from "@apollo/client";

export const FEEDBACKS_QUERY = gql`
  query feedbacks($page: Int!, $per_page: Int!) {
    feedbacks(page: $page, per_page: $per_page) {
      count
      values {
        id
        text
        highlights {
          summary
          quote
        }
      }
    }
  }
`;

export const FEEDBACK_ADDED_SUBSCRIPTION = gql`
  subscription {
    feedbackAdded {
      id
      text
      highlights {
        summary
        quote
      }
    }
  }
`;
