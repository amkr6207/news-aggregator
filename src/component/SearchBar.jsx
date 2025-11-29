import React from "react";

function SearchBar({
  category,
  setCategory,
  country,
  setCountry,
  keyword,
  setKeyword,
  categories,
  onClear,
}) {
  const countries = [
    { code: "in", name: "India" },
    { code: "us", name: "USA" },
    { code: "gb", name: "UK" },
    { code: "au", name: "Australia" },
    { code: "ca", name: "Canada" },
  ];

  return (
    <div className="d-flex gap-md mb-lg" style={{ flexWrap: 'wrap' }}>
      {/* Country selector */}
      <div style={{ flex: '1 1 150px' }}>
        <select
          aria-label="Select country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category selector */}
      <div style={{ flex: '1 1 200px' }}>
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
      </div>

      {/* Keyword input */}
      <div style={{ flex: '2 1 300px' }}>
        <input
          type="text"
          aria-label="Search news keyword"
          placeholder="Search keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* Clear search button */}
      <button
        onClick={onClear}
        className="btn btn-outline"
        aria-label="Clear search input"
      >
        Clear
      </button>
    </div>
  );
}

export default SearchBar;
