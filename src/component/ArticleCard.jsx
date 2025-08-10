import React from "react";

function ArticleCard({ article }) {
  return (
    <div className="article-card">
      {article.urlToImage && (
        <img src={article.urlToImage} alt="Article thumbnail" />
      )}

      <div className="article-content">
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="article-title"
        >
          {article.title}
        </a>

        <p className="article-description">{article.description}</p>

        <small className="article-meta">
          {article.source.name} -{" "}
          {new Date(article.publishedAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  );
}

export default ArticleCard;
