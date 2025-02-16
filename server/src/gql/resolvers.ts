import feedbackStore from "../store/feedback";
import feeedbackService from "../service/feedback";
import feedback from "../store/feedback";
import { count } from "console";
import { text } from "stream/consumers";

/**
 * GraphQL Resolvers
 */
const resolvers = {
  Query: {
    feedback: (parent: unknown, args: {id: number}) => {
      return feedbackStore.getFeedback(args.id)
    },
    feedbacks: (parent: unknown, args: { page: number; per_page: number }) => {
      return feeedbackService.getFeedbackPage(args.page, args.per_page)
    },
    highlightcount: () => {
      return feedbackStore.countHighlight();
    },
    highlights: async (parent: unknown, args: { page: number; per_page: number }) => {
      const highlights = await feedbackStore.getHighlightPage(args.page, args.per_page)
      return { values: highlights, count: highlights.length};
    }
  },
  Mutation: {
    createFeedback: (parent: unknown, args: { text: string }) => {
      return feeedbackService.createFeedback(args.text)
    },
    bulkCreateFeedback: (_: unknown, args: { texts: string[] }) => {
      return args.texts.map((text) => feeedbackService.createFeedback(text))
    }
  },
  // use the id from the parent object to query from db
  Feedback: {
    highlights: (parent: {id: number}) => {
      return feedbackStore.getFeedbackHighlights(parent.id)
    }
  },
  Highlight: {
    feedback: async (parent: {id: number}) => {
      const feedback = await feedbackStore.getFeedbackForHighlight(parent.id) as {text: string};
      return feedback.text;
    }
  }
};

export default resolvers;