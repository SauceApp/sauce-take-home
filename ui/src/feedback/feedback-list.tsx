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
            <div className="mt-2 space-y-2">
              {feedback.highlights.map((highlight) => (
                <div key={highlight.id} className="text-sm text-gray-300">
                  <p>
                    <span className="font-semibold text-gray-100">Quote:</span> {highlight.quote}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-100">Summary:</span> {highlight.summary}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}