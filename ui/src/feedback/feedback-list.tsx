import {useEffect, useState} from "react";
import {Feedback, feedbacksQuery} from "./api.ts";


export default function FeedbackList() {
  const [page, setPage] = useState(1);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

  useEffect(() => {
    feedbacksQuery(page, 10).then((result) => setFeedbacks(result.feedbacks.values));
  }, [page]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Feedback</h1>
      {feedbacks.map((feedback) => (
        <div
          key={feedback.id}
          className="bg-slate-700 bg-opacity-20 hover:bg-opacity-30 cursor-pointer rounded-lg py-2 px-4 text-left"
        >
          <p className="text-red-300">{feedback.text}</p>
          {feedback.highlights && feedback.highlights.length > 0 && (
            <ul className="mt-2 ml-4 space-y-1">
              {feedback.highlights.map((highlight) => (
                <li key={highlight.id} className="text-green-300">
                  <p><strong>Quote:</strong> {highlight.quote}</p>
                  <p><strong>Summary:</strong> {highlight.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}