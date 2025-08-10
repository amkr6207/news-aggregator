import React from "react";

function SearchBar({
  category,
  setCategory,
  keyword,
  setKeyword,
  categories,
  onClear,
}) {
  return (
    <div className="search-bar">
      {/* Category selector */}
      <select
        aria-label="Select news category"
        value={category}
        onChange={(e) => {
          setKeyword("");
          setCategory(e.target.value);
        }}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      {/* Keyword input */}
      <input
        type="text"
        aria-label="Search news keyword"
        placeholder="Search keyword..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      {/* Clear search button */}
      <button
        onClick={onClear}
        className="btn btn-outline-secondary"
        aria-label="Clear search input"
      >
        Clear
      </button>
    </div>
  );
}

export default SearchBar;
