import {gql, request} from "graphql-request";

export type Highlight = {
  id: number
  quote: string
  summary: string
  feedback: string
}

export type Feedback = {
  id: number
  text: string
  highlights: [Highlight]
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

const highlightsDocument = gql`
  query highlights($page: Int!, $per_page: Int!) {
    highlights(page: $page, per_page: $per_page) {
      values {
        id
        quote
        summary
        feedback
      }
      count
    }
  }
`

type FeedbacksData = { feedbacks: { values: Feedback[], count: number } }
export const feedbacksQuery = (page: number, per_page: number): Promise<FeedbacksData> =>
  request('http://localhost:4000/graphql', feedbacksDocument, {
    page,
    per_page
  })

  type HighlightsData = { highlights: { values: Highlight[], count: number } }
  export const highlightsQuery = (page: number, per_page: number): Promise<HighlightsData> =>
    request('http://localhost:4000/graphql', highlightsDocument, {
      page,
      per_page
    })

export const highlightcount = async (): Promise<{ highlightcount: number}> => 
  request('http://localhost:4000/graphql', 
    `query {
      highlightcount
    }`
  );