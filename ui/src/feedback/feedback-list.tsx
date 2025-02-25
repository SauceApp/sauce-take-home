import {useEffect, useState} from "react";
import {Feedback, feedbacksQuery} from "./api.ts";

export default function FeedbackList() {
  const [page, setPage] = useState(1);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const perPage = 5;

  useEffect(() => {
    const fetchFeedbacks = async () => {
        const result = await feedbacksQuery(page, perPage);
        setFeedbacks(result.feedbacks.values);
    };
    fetchFeedbacks();
  }, [page, perPage]);

  const isLastFeedback = feedbacks.some(feedback => feedback.id === 1);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Feedback</h1>
      {feedbacks.map((feedback) => (
        <button key={feedback.id} className="bg-slate-700 bg-opacity-20 hover:bg-opacity-30 cursor-pointer rounded-lg py-2 px-4 text-left">
          <p className="text-red-300">{feedback.text}</p>
            {feedback.highlights.map((highlight) => (
              <div key={highlight.id} >
                <p className="text-gray-400">{highlight.quote}</p>
                <p className="text-gray-400">{highlight.summary}</p>
              </div>
            ))}
        </button>
      ))}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={isLastFeedback}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
