import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { FEEDBACKS_QUERY, FEEDBACK_ADDED_SUBSCRIPTION } from "./queries";

export default function FeedbackList() {
  const [page, setPage] = useState(1);
  const { loading, error, data, subscribeToMore, refetch } = useQuery(
    FEEDBACKS_QUERY,
    {
      variables: { page, per_page: 10 },
      fetchPolicy: "cache-and-network",
    }
  );

  // Subscribe to new feedback events and merge them into the current list
  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: FEEDBACK_ADDED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newFeedback = subscriptionData.data.feedbackAdded;
        return {
          feedbacks: {
            count: prev.feedbacks.count + 1,
            values: [newFeedback, ...prev.feedbacks.values],
          },
        };
      },
    });
    return () => unsubscribe();
  }, [subscribeToMore]);

  // Optionally, refetch periodically so that updates (like highlights being added) are visible.
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 5000); // refetch every 5 seconds
    return () => clearInterval(intervalId);
  }, [refetch]);

  if (loading) return <p>Loading feedback...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { values } = data.feedbacks;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Feedback</h1>
      {/* Use a grid layout with 3 columns and a gap between items */}
      <div className="grid grid-cols-3 gap-4">
        {values.map((feedback: any) => (
          <button
            key={feedback.id}
            className="bg-slate-700 bg-opacity-20 hover:bg-opacity-30 cursor-pointer rounded-lg py-2 px-4 text-left"
          >
            <p className="text-red-300">{feedback.text}</p>
            <div className="mt-2">
              <h3 className="text-lg font-semibold mb-2">Highlights:</h3>
              {feedback.highlights && feedback.highlights.length > 0 ? (
                <div className="space-y-1">
                  {feedback.highlights.map((highlight: any, idx: number) => (
                    <p key={idx} className="text-green-300 text-sm">
                      • {highlight.summary}{" "}
                      <span className="text-gray-400 text-xs">
                        ({highlight.quote})
                      </span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-yellow-300 text-sm">Loading highlights...</p>
              )}
            </div>
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
