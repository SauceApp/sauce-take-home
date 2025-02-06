import {useEffect, useState} from "react";
import {feedbacksQuery} from "./api.ts";
import { Feedback } from "../interface/feedback";
import FeedbackCard from "./components/FeedbackCard.tsx";


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
        <FeedbackCard key = {feedback.id} feedback = {feedback}/>
      ))}
    </div>
  );
}