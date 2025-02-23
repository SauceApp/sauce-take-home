import feedbackStore from "../store/feedback";
import prompt from "../ai/prompt";

/**
 * Creates a feedback entry and triggers highlight analysis asynchronously.
 * 
 * This implementation allows bulk creation without having the API wait for
 * the highlight creation. The analysis and subsequent highlight insertion happen
 * in a "fire-and-forget" manner, and any errors from the analysis are logged.
 *
 * @param text The feedback to create
 */
const createFeedback = async (text: string) => {
  // Persist the feedback immediately.
  const feedback = await feedbackStore.createFeedback(text);

  // Start the AI analysis in the background without waiting for it to complete.
  (async () => {
    try {
      const analysisResult = await prompt.runFeedbackAnalysis(feedback.text);
      
      if (analysisResult.highlights && analysisResult.highlights.length > 0) {
        // Persist each highlight without blocking the main thread.
        for (const highlight of analysisResult.highlights) {
          await feedbackStore.createHighlight({
            feedbackId: feedback.id,
            highlightQuote: highlight.quote,
            highlightSummary: highlight.summary,
          });
        }
      }
    } catch (error) {
      console.error("Error generating highlights:", error);
    }
  })();

  // Immediately return the created feedback record.
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
  return { values, count };
}

export default {
  createFeedback,
  getFeedbackPage,
}