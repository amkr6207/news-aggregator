import React from "react";

function ArticleCard({ article }) {
  return (
    <div className="card h-100">
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt="Article thumbnail"
          className="w-100 object-cover"
          style={{ height: '200px', width: '100%', objectFit: 'cover' }}
        />
      )}

      <div className="p-md d-flex" style={{ flexDirection: 'column', flex: 1, padding: 'var(--spacing-md)' }}>
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            textDecoration: 'none',
            color: 'var(--color-text-main)',
            marginBottom: 'var(--spacing-sm)',
            display: 'block'
          }}
        >
          {article.title}
        </a>

        <p className="text-muted" style={{ fontSize: '0.9rem', flex: 1 }}>
          {article.description}
        </p>

        <small className="text-muted" style={{ display: 'block', marginTop: 'auto', fontSize: '0.8rem' }}>
          {article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  );
}

export default ArticleCard;
