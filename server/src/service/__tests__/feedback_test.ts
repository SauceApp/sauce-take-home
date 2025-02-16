import feedbackService from "../feedback";
import feedbackStore from "../../store/feedback";
import prompt from "../../ai/prompt";
import { AnalysisStatus } from "../../store/model";

// mock dependencies
jest.mock("../../store/feedback");
jest.mock("../../ai/prompt");
jest.mock("openai", () => {
    return {
      OpenAI: jest.fn().mockImplementation(() => {
        return {
          chat: jest.fn().mockResolvedValue({
            data: {
              choices: [{ message: { content: "This is a mock response" } }],
            },
          }),
        };
      }),
    };
  });

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("feedbackService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // clear the mock calls after each test
  });

  describe("createFeedback", () => {
    it("should create feedback and call analysis", async () => {

      // create a mock feedback
      const mockFeedback = { id: 1, text: "testing feedback text" };
      ((feedbackStore.createFeedback) as jest.Mock).mockResolvedValue(mockFeedback);
      
      // run feedback analysis
      const mockAnalysis = { highlights: [] };
      (prompt.runFeedbackAnalysis as jest.Mock).mockResolvedValue(mockAnalysis);

      // call the createFeedback function
      const result = await feedbackService.createFeedback("testing feedback text");

      // verify that feedbackStore.createFeedback is called
      expect(feedbackStore.createFeedback).toHaveBeenCalledWith("testing feedback text");

      // verify that prompt.runFeedbackAnalysis is called with feedback text
      expect(prompt.runFeedbackAnalysis).toHaveBeenCalledWith(mockFeedback.text);

      // verify that the result is the same as what we created above
      expect(result).toEqual(mockFeedback);
    });

    it("should handle errors in analysis and update status", async () => {

      // create a mock feedback
      const mockFeedback = { id: 1, text: "testing feedback text" };
      (feedbackStore.createFeedback as jest.Mock).mockResolvedValue(mockFeedback);
      // run feedback analysis to throw an error
      const mockError = new Error("ANALYSIS_FAILED");
      (prompt.runFeedbackAnalysis as jest.Mock).mockRejectedValue(mockError);

      // call the createFeedback function
      await feedbackService.createFeedback("testing feedback text");

      // wait for prompt mock rejection to be caught in createFeedback (500 milliseconds)
      await wait(500);
      // verify that the result is expected
      expect(feedbackStore.updateFeedbackStatus as jest.Mock).toHaveBeenCalledWith(
        mockFeedback.id,
        AnalysisStatus.FAILED,
        `Failed to generate highlight with error: ${mockError.message}`
      );
    });
  });
  describe("getFeedbackPage", () => {
    it("should return a page of feedback entries", async () => {
      // mock data
      const mockFeedbackEntries = [
        { id: 1, text: "Feedback 1" },
        { id: 2, text: "Feedback 2" },
      ];

      (feedbackStore.getFeedbackPage as jest.Mock).mockResolvedValue(mockFeedbackEntries);

      // calling the getFeedbackPage function
      const page = 1;
      const perPage = 2;
      const result = await feedbackService.getFeedbackPage(page, perPage);

      // verify the results
      expect(feedbackStore.getFeedbackPage).toHaveBeenCalledWith(page, perPage);
      expect(result.values).toEqual(mockFeedbackEntries);
      expect(result.count).toBe(mockFeedbackEntries.length);
    });

    it("should return an empty result if no feedback entries are found", async () => {
      // testing empty array being returned when getFeedbackPage is called
      (feedbackStore.getFeedbackPage as jest.Mock).mockResolvedValue([]);

      // call the getFeedbackPage function
      const page = 1;
      const perPage = 2;
      const result = await feedbackService.getFeedbackPage(page, perPage);

      // verify the results
      expect(feedbackStore.getFeedbackPage).toHaveBeenCalledWith(page, perPage);
      expect(result.values).toEqual([]);
      expect(result.count).toBe(0);
    });
  });
});