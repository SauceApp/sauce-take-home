import {zodToJsonSchema} from "zod-to-json-schema";
import openAIClient from "./client";
import {v4} from "uuid";
import {HighlightPromptResult, highlightPromptResultSchema} from "./models";


/**
 * This function takes in a feedback string and returns the highlights of the feedback.
 *
 * This will run the feedback through an AI prompt to extract the highlights.
 * A highlight contains:
 * - The quote from the source feedback.
 * - A condensed summary of the quote.
 *
 * @param feedback The feedback to analyze
 */
const runFeedbackAnalysis = async (feedback: string): Promise<HighlightPromptResult> => {
  const promptId = v4();

  // Send OpenAI completion request and return the highlights
  const prompt =
    "Analyze the feedback and return a list of highlights within the feedback if any exist." +
    "A highlight should be an issue or feature request from the given feedback." +
    "\n" +
    "You are only allowed to speak in raw JSON. Do not wrap the response in markdown." +
    "\n" +
    "The result should have the following shape:" +
    "\n" +
    `${JSON.stringify(zodToJsonSchema(highlightPromptResultSchema))}` +
    "\n" +
    "The feedback to analyze:" +
    "\n" +
    feedback;
    
  console.log();
  console.log(`+++++++ FEEDBACK ANALYSIS START ID (${promptId}) +++++++`);
  console.log(prompt);
  console.log(`+++++++ FEEDBACK ANALYSIS END ID (${promptId}) +++++++`);
  console.log();

  const response = await openAIClient.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{
      role: "user",
      content: prompt
    }],
  });
  if (!response.choices[0].message.content) {
    throw new Error("OpenAI did not return a message.");
  }

  const parsed = highlightPromptResultSchema.safeParse(
    JSON.parse(response.choices[0].message.content)
  );  
  if (!parsed.success) {
    throw new Error("Failed to parse OpenAI response.");
  }

  console.log();
  console.log(`+++++++ ANALYSIS RESULT START ID (${promptId}) +++++++`);
  console.log(parsed.data);
  console.log(`+++++++ ANALYSIS RESULT END ID (${promptId}) +++++++`);
  console.log();

  return parsed.data;
}

export default {
  runFeedbackAnalysis,
}