import feedbackStore from "../store/feedback";
import prompt from "../ai/prompt";

/**
 * Creates a feedback entry and runs analysis on it.
 * @param text The feedback to create
 */
const createFeedback = async (text: string) => {
    // todo may need error handling here
    const feedback = await feedbackStore.createFeedback(text);
    const analysisResult = await prompt.runFeedbackAnalysis(feedback.text);
    console.debug('Retrieved analysis result', analysisResult);

    // After analysis, persist the result information to the db
    // todo - maybe some if/else action here to check the array isn't empty, saves us from running unnecessary logic
    await Promise.all(
        analysisResult.highlights.map(async highlight => {
            try {
                await feedbackStore.createHighlight({
                    feedbackId: feedback.id,
                    highlightQuote: highlight.quote,
                    highlightSummary: highlight.summary
                })
            } catch (error) {
                //Log any errors caught
                console.error(`Failed to create highlight for quote: ${highlight.quote}, summary: ${highlight.summary}`, error)
            }
        }));

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