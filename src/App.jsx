import { useState, useEffect, useCallback } from "react";
import SearchBar from "./component/SearchBar";
import ArticleList from "./component/ArticleList";

const API_KEY = "07b09d0cdeeb4e168de7e071fde9cc84"; // Your NewsAPI key
const categories = ["general", "technology", "sports", "business"];
const PAGE_SIZE = 10; // Number of articles per page

const MAX_RESULTS = 100; // NewsAPI free tier max results
const MAX_PAGE = Math.ceil(MAX_RESULTS / PAGE_SIZE); // Max page number allowed

function App() {
  // States for filters, articles, pagination, loading, error, dark mode
  const [category, setCategory] = useState("general");
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState([]); // Stores fetched articles list
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Determine if more articles can be loaded (respecting API limits)
  const canLoadMore = articles.length < totalResults && page < MAX_PAGE;

  // Fetch news from API with pagination and append options
  const fetchNews = async (pageToFetch = 1, append = false) => {
    setLoading(true);
    setError(null);

    try {
      let url = "";
      if (keyword.trim() !== "") {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          keyword
        )}&apiKey=${API_KEY}&pageSize=${PAGE_SIZE}&page=${pageToFetch}`;
      } else {
        url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}&pageSize=${PAGE_SIZE}&page=${pageToFetch}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== "ok") {
        throw new Error(data.message || "Failed to fetch news");
      }

      setTotalResults(data.totalResults || 0);

      if (append) {
        setArticles((prev) => [...prev, ...data.articles]);
      } else {
        setArticles(data.articles);
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // Load more articles by incrementing page and fetching more
  const handleLoadMore = () => {
    if (!loading && canLoadMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, true);
    }
  };

  // Scroll event handler for infinite scroll
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100 &&
      !loading &&
      canLoadMore
    ) {
      handleLoadMore();
    }
  }, [loading, canLoadMore]);

  // Add/remove scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Fetch news on category or keyword change; reset page
  useEffect(() => {
    setPage(1);
    fetchNews(1, false);
  }, [category, keyword]);

  // Persist dark mode setting in localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  // Toggle dark mode state
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`container my-4 ${
        isDarkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
      style={{ maxWidth: "900px", minHeight: "100vh" }}
    >
      {/* Header with Dark Mode Toggle */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Personalized News Aggregator</h1>
        <button
          className={`btn btn-outline-${isDarkMode ? "light" : "dark"}`}
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          type="button"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Search and filter bar */}
      <SearchBar
        category={category}
        setCategory={setCategory}
        keyword={keyword}
        setKeyword={setKeyword}
        categories={categories}
      />

      {/* Loading spinner */}
      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div
            className="spinner-border text-primary"
            role="status"
            aria-label="Loading"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-center text-danger">Error: {error}</p>}

      {/* Articles list */}
      <ArticleList articles={articles} />

      {/* Inform user when no more results available */}
      {!canLoadMore && articles.length > 0 && !loading && (
        <p className="text-center text-muted my-4">
          No more articles available.
        </p>
      )}
    </div>
  );
}

export default App;
