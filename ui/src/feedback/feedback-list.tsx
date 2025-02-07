import {useEffect, useState} from "react";
import {Feedback, feedbacksQuery} from "./api.ts";


export default function FeedbackList() {
  const [page, setPage] = useState(1);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

  useEffect(() => {
    feedbacksQuery(page, 10).then((result) => setFeedbacks(result.feedbacks.values));
  }, [page]);

  // todo let's split out css, might get ugly
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Feedback</h1>
      {feedbacks.map((feedback) => (
        <button key={feedback.id} className="bg-slate-700 bg-opacity-20 hover:bg-opacity-30 cursor-pointer rounded-lg py-2 px-4 text-left">
          <p className="text-red-300">{feedback.text}</p>
        </button>
      ))}
    </div>
  );
}