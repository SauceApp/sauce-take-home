import feedbackStore from "../store/feedback";
import prompt from "../ai/prompt";

/**
 * Creates a feedback entry and runs analysis on it.
 * @param text The feedback to create
 */
const createFeedback = async (text: string) => {
  const feedback = await feedbackStore.createFeedback(text);
  const analysisResult = await prompt.runFeedbackAnalysis(feedback.text);

  if (analysisResult.highlights && analysisResult.highlights.length > 0) {
    for (const highlight of analysisResult.highlights) {
      await feedbackStore.createHighlight({
        feedbackId: feedback.id,
        highlightQuote: highlight.quote,
        highlightSummary: highlight.summary,
      })
    }
  }

  return feedback;
}

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
}