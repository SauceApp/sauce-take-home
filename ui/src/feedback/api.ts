import {gql, request} from "graphql-request";

export type Feedback = {
  id: number
  text: string
    highlights: Highlight[]
}

export type Highlight = {
    id: number
    quote: string
    summary: string
}

const feedbacksDocument = gql`
  query feedbacks($page: Int!, $per_page: Int!) {
    feedbacks(page: $page, per_page: $per_page) {
      values {
        id
        text
        highlights {
          id
          quote 
          summary
         }
      }
      count
    }
  }
`

type FeedbacksData = { feedbacks: { values: Feedback[], count: number } }

// todo error handling here incase request fails?
export const feedbacksQuery = (page: number, perPage: number): Promise<FeedbacksData> =>
  request('http://localhost:4000/graphql', feedbacksDocument, {
    page,
    per_page: perPage
  })
