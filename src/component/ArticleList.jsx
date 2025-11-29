import React from "react";
import ArticleCard from "./ArticleCard";

// ArticleList component to render a list of articles or a friendly empty message
function ArticleList({ articles }) {

  return (
    <div className="grid grid-cols-1 grid-cols-2 grid-cols-3">
      {/* If no articles, show user-friendly message */}
      {articles.length === 0 ? (
        <div className="text-center mt-xl" style={{ gridColumn: '1 / -1' }}>
          {/* Inline SVG icon for inbox */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="currentColor"
            className="mb-lg text-muted"
            viewBox="0 0 16 16"
            aria-hidden="true" // Hide from screen readers (decorative)
          >
            <path d="M4.98 1a.5.5 0 0 0-.39.188L1.25 5H0v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5h-1.25l-3.34-3.812A.5.5 0 0 0 11.02 1H4.98zM14 6v6H2V6h12zm-5.5 5a.5.5 0 0 0 0-1h-3a.5.5 0 0 0 0 1h3z" />
          </svg>
          <h5 className="text-muted">No articles found</h5>
          <p>Try a different category or search keyword.</p>
        </div>
      ) : (
        // Map over articles to render each ArticleCard
        articles.map((article, index) => (
          <ArticleCard key={index} article={article} />
        ))
      )}
    </div>
  );
}

export default ArticleList;
