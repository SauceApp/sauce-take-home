import { gql, request } from "graphql-request";

export type Feedback = {
  id: number;
  text: string;
  highlights?: string[];
};

const feedbacksDocument = gql`
  query feedbacks($page: Int!, $per_page: Int!) {
    feedbacks(page: $page, per_page: $per_page) {
      values {
        id
        text
        highlights {
          summary
          quote
        }
      }
      count
    }
  }
`;

type FeedbacksData = { feedbacks: { values: Feedback[]; count: number } };
export const feedbacksQuery = (
  page: number,
  per_page: number
): Promise<FeedbacksData> =>
  request("http://localhost:4000/graphql", feedbacksDocument, {
    page,
    per_page,
  });
