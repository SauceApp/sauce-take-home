import feedbackStore from "../store/feedback";
import prompt from "../ai/prompt";

/**
 * Creates a feedback entry and runs analysis on it.
 * @param text The feedback to create
 */
const createFeedback = async (text: string) => {
  const feedback = await feedbackStore.createFeedback(text);
  const analysisResult = await prompt.runFeedbackAnalysis(feedback.text);
  const highlights = analysisResult.highlights.map((highlight) => {
    return feedbackStore.createHighlight({
      feedbackId: feedback.id,
      highlightSummary: highlight.summary,
      highlightQuote: highlight.quote,
    });
  });

  console.log(`Created ${highlights.length} highlights for feedback entry with id: ${feedback.id}`);
  return feedback;
}

const createBulkFeedback = async (texts: string[]) => {
  const feedbacks = await Promise.all(
    texts.map(async (text) => {
      const feedback = await feedbackStore.createFeedback(text);
      const analysisResult = await prompt.runFeedbackAnalysis(feedback.text);
      const highlights = analysisResult.highlights.map(async (highlight) => {
          return feedbackStore.createHighlight({
            feedbackId: feedback.id,
            highlightSummary: highlight.summary,
            highlightQuote: highlight.quote,
          });
        }
      );
      console.log(`Created ${highlights.length} highlights for feedback ID: ${feedback.id}`);
      return { ...feedback, highlights };
    })
  );
  console.log(`Successfully created ${feedbacks.length} feedback entries`);
  return feedbacks;
};

/**
 * Gets a page of feedback entries
 * @param page The page number
 * @param perPage The number of entries per page
 */
const getFeedbackPage = async (page: number, perPage: number) => {
  const values = await feedbackStore.getFeedbackPage(page, perPage);
  const count = values.length;
  return {values, count};
}

export default {
  createFeedback,
  getFeedbackPage,
  createBulkFeedback,
}