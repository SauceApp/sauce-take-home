import db from "./db";

type CreateHighlightArgs = {
  feedbackId: number | bigint;
  highlightSummary: string;
  highlightQuote: string;
}

/**
 * Gets a feedback entry by its id
 * @param id The id of the feedback
 */
const getFeedback = async (id: number) => {
  return db.prepare(`SELECT *
                     FROM Feedback
                     WHERE id = ?`).get(id)
}

/**
 * Gets a feedback text from its corresponding higlight
 * @param id The id of the feedback
 */
const getFeedbackForHighlight = async (id: number) => {
  return db.prepare(`SELECT text
                     FROM Feedback
                     WHERE id = (SELECT feedbackId 
                     FROM Highlight 
                     where id = ?)`).get(id)
}

/**
 * Gets a page of feedback entries
 * @param page The page number
 * @param perPage The number of entries per page
 */
const getFeedbackPage = async (page: number, perPage: number) => {
  return db.prepare(`SELECT *
                     FROM Feedback
                     ORDER BY id DESC
                     LIMIT ? OFFSET ?`).all(perPage, (page - 1) * perPage)
}

/**
 * Gets the highlights of a feedback entry
 * @param feedbackId The id of the feedback
 */
const getFeedbackHighlights = async (feedbackId: number) => {
  return db.prepare(`SELECT *
                     FROM Highlight
                     WHERE feedbackId = ?`).all(feedbackId)
}

/**
 * Gets a page of higlight entries
 */
const getHighlightPage = async (page: number, perPage: number) => {
  return db.prepare(`SELECT *
                     FROM Highlight
                     ORDER BY id DESC
                     LIMIT ? OFFSET ?`).all(perPage, (page - 1) * perPage)
}

/**
 * Counts the number of highlight entries
 * @returns The number of highlight entries
 */

const countHighlight = (): number => {
  const stmt = db.prepare(`SELECT COUNT(*) as count
                          FROM Highlight`);
  
  const result = stmt.get() as { count: number };
  return result.count;
}

/**
 * Creates a new feedback entry
 * @param text The text of the feedback
 */
const createFeedback = async (text: string) => {
  const result = db.prepare(`INSERT INTO Feedback (text)
                             VALUES (?)`).run(text);
  return {id: result.lastInsertRowid, text}
}

/**
 * Creates a new highlight entry
 * @param args The arguments to create a highlight
 */
const createHighlight = async (args: CreateHighlightArgs) => {
  const result = db.prepare(`INSERT INTO Highlight (quote, summary, feedbackId)
                             VALUES (?, ?, ?)`).run(args.highlightSummary, args.highlightQuote, args.feedbackId);
  return {id: result.lastInsertRowid, ...result}
}

export default {getFeedback, getFeedbackPage, createFeedback, createHighlight, getFeedbackHighlights, countHighlight, getHighlightPage, getFeedbackForHighlight};