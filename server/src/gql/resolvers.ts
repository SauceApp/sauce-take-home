import feedbackStore from "../store/feedback";
import feeedbackService from "../service/feedback";
import { pubsub, FEEDBACK_ADDED } from "./pubsub";

interface Feedback {
  id: number;
  text: string;
}

const resolvers = {
  Query: {
    feedback: (parent: unknown, args: { id: number }) => {
      return feedbackStore.getFeedback(args.id);
    },
    feedbacks: (parent: unknown, args: { page: number; per_page: number }) => {
      return feeedbackService.getFeedbackPage(args.page, args.per_page);
    },
  },
  Mutation: {
    createFeedback: async (parent: unknown, args: { text: string }) => {
      const feedback = await feeedbackService.createFeedback(args.text);

      pubsub.publish(FEEDBACK_ADDED, { feedbackAdded: feedback });
      return feedback;
    },
  },
  Feedback: {
    highlights: async (parent: Feedback) => {
      return await feedbackStore.getFeedbackHighlights(parent.id);
    },
  },
  Subscription: {
    feedbackAdded: {
      subscribe: () => pubsub.subscribe(FEEDBACK_ADDED),
    },
  },
};

export default resolvers;
