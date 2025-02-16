import {useEffect, useState} from "react";
import {Feedback, feedbacksQuery, feedbackCount} from "./api.ts";
import "./feedback.css";


export default function FeedbackList() {
  const [page, setPage] = useState(1);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [expandedFeedbacks, setExpandedFeedbacks] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const feedbacksPerPage = 10;

  // fetching total feedback count
  useEffect(() => {
    feedbackCount().then((count) => {
      setTotalPages(Math.ceil(count.feedbackCount / feedbacksPerPage))
    })
  }, [page]);

  // fetching the feedbacks for the current page
  useEffect(() => {
    feedbacksQuery(page, feedbacksPerPage).then((result) => setFeedbacks(result.feedbacks.values));
  }, [page]);

  const toggleShowMore = (id: number) => {
    setExpandedFeedbacks((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Content */}
      <div className="space-y-4 flex-grow">
        <h1 className="text-2xl font-semibold">Feedback</h1>
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="feedback-card">
            {feedback.highlights && feedback.highlights.length > 0 && (
              <div className="highlight-section">
                {feedback.highlights.map((highlight, index) => (
                  <div key={index} className="highlight-item">
                    <h2 className="highlight-quote">
                      {highlight.quote}
                    </h2>
                    <p className="highlight-summary">
                      {highlight.summary}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <p className="text-gray-300">
              {expandedFeedbacks.includes(feedback.id)
                ? feedback.text
                : `${feedback.text.slice(0, 100)}...`}
            </p>

            <button
              onClick={() => toggleShowMore(feedback.id)}
              className="text-blue-400 hover:underline mt-2"
            >
              {expandedFeedbacks.includes(feedback.id) ? "Show Less" : "Show More"}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="pagination-container">
        <button
          onClick={goToPrevPage}
          disabled={page === 1}
          className="pagination-button"
        >
          Previous
        </button>

        <div className="page-numbers">
          {page > 2 && (
            <>
              <button
                onClick={() => setPage(1)}
                className="pagination-number"
              >
                1
              </button>
              <span className="ellipsis">...</span>
            </>
          )}
          {Array.from({ length: 3 }, (_, index) => {
            const pageNumber = page - 1 + index; // calculate current range of pages
            if (pageNumber > 0 && pageNumber <= totalPages) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`pagination-number ${
                    page === pageNumber ? "active" : ""
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }
            return null;
          })}
          {page < totalPages - 1 && (
            <>
              <span className="ellipsis">...</span>
              <button
                onClick={() => setPage(totalPages)}
                className="pagination-number"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={goToNextPage}
          disabled={page === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}