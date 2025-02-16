import { useEffect, useState } from "react";
import { Highlight, feedbacksQuery, highlightcount, highlightsQuery } from "./api.ts";
import "./feedback.css";

export default function FeedbackList() {
  const [page, setPage] = useState(1);
  // const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [expandedFeedbacks, setExpandedFeedbacks] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const highlightsPerPage = 1;

  // Fetching total feedback count
  useEffect(() => {
    highlightcount().then((count) => {
      setTotalPages(Math.ceil(count.highlightcount / highlightsPerPage));
      console.log(count)
    });
  }, [page]);

  // Fetching the feedbacks for the current page
  // useEffect(() => {
  //   feedbacksQuery(page, highlightsPerPage).then((result) =>
  //     setFeedbacks(result.feedbacks.values)
  //   );
  // }, [page]);

  useEffect(() => {
    highlightsQuery(page, highlightsPerPage).then((result) =>
      setHighlights(result.highlights.values)
    );
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
        

        {highlights.map((highlight, index) => (
          <div key={`${highlight.id}-${index}`} className="feedback-card">
            <div className="highlight-section">
              <h2 className="highlight-quote">{highlight.quote}</h2>
              <p className="highlight-summary">{highlight.summary}</p>
            </div>
            <p className="text-gray-300">
              {/* Feedback ID: {feedback.id} -{" "} */}
              {expandedFeedbacks.includes(highlight.id)
                ? highlight.feedback
                : `${highlight.feedback.slice(0, 100)}...`}
            </p>
              <button
                onClick={() => toggleShowMore(highlight.id)}
                className="text-blue-400 hover:underline mt-2"
              >
                {expandedFeedbacks.includes(highlight.id)
                  ? "Show Less"
                  : "Show More"}
              </button>
            </div>
          ))  
        }
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
              <button onClick={() => setPage(1)} className="pagination-number">
                1
              </button>
              <span className="ellipsis">...</span>
            </>
          )}
          {Array.from({ length: 3 }, (_, index) => {
            const pageNumber = page - 1 + index;
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
