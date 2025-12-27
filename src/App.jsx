import { useState, useEffect, useCallback } from "react";
import SearchBar from "./component/SearchBar";
import ArticleList from "./component/ArticleList";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY; // Your NewsAPI key
const categories = ["general", "technology", "sports", "business"];
const PAGE_SIZE = 10; // Number of articles per page

const MAX_RESULTS = 100; // NewsAPI free tier max results
const MAX_PAGE = Math.ceil(MAX_RESULTS / PAGE_SIZE); // Max page number allowed

function App() {
  // States for filters, articles, pagination, loading, error, dark mode
  const [category, setCategory] = useState("general");
  const [country, setCountry] = useState("in"); // Default to India
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState([]); // Stores fetched articles list
  const [page, setPage] = useState(1); // Tracks current page for pagination or infinite scroll.
  const [totalResults, setTotalResults] = useState(0); // Stores total number of available articles from API.
  const [loading, setLoading] = useState(false); // Indicates whether API is currently fetching data .
  const [error, setError] = useState(null); // Stores any error message during API fetching.
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Determine if more articles can be loaded (respecting API limits)
  const canLoadMore = articles.length < totalResults && page < MAX_PAGE;

  // Fetch news from API with pagination and append options
  const fetchNews = useCallback(
    async (pageToFetch = 1, append = false) => {
      setLoading(true);
      setError(null);

      try {
        let url = "";

        // Map countries to popular news domains for that country
        const countryDomains = {
          in: "timesofindia.indiatimes.com,hindustantimes.com,indianexpress.com",
          us: "cnn.com,nytimes.com,washingtonpost.com,foxnews.com",
          gb: "bbc.co.uk,bbc.com,theguardian.com,independent.co.uk,telegraph.co.uk,dailymail.co.uk,mirror.co.uk,express.co.uk,metro.co.uk,standard.co.uk",
          au: "abc.net.au,news.com.au,smh.com.au",
          ca: "cbc.ca,theglobeandmail.com,nationalpost.com",
        };

        if (keyword.trim() !== "") {
          // When searching by keyword, use everything endpoint
          url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            keyword
          )}&language=en&apiKey=${API_KEY}&pageSize=${PAGE_SIZE}&page=${pageToFetch}&sortBy=publishedAt`;
        } else {
          // Use everything endpoint with domains for country-specific news
          const domains = countryDomains[country] || countryDomains["us"];

          // For category filtering, use it as a search term (but make it optional for 'general')
          if (category !== "general") {
            url = `https://newsapi.org/v2/everything?domains=${domains}&q=${category}&language=en&apiKey=${API_KEY}&pageSize=${PAGE_SIZE}&page=${pageToFetch}&sortBy=publishedAt`;
          } else {
            // For general, just get all news from the domains
            url = `https://newsapi.org/v2/everything?domains=${domains}&language=en&apiKey=${API_KEY}&pageSize=${PAGE_SIZE}&page=${pageToFetch}&sortBy=publishedAt`;
          }
        }

        console.log(
          "Fetching news from:",
          url.replace(API_KEY, "API_KEY_HIDDEN")
        );

        const response = await fetch(url);
        const data = await response.json();

        console.log("API Response:", {
          status: data.status,
          totalResults: data.totalResults,
          articlesCount: data.articles?.length,
        });

        if (data.status !== "ok") {
          throw new Error(data.message || "Failed to fetch news");
        }

        setTotalResults(data.totalResults || 0);

        if (append) {
          setArticles((prev) => [...prev, ...data.articles]);
        } else {
          setArticles(data.articles || []);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(err.message);
      }

      setLoading(false);
    },
    [keyword, country, category]
  );

  // Load more articles by incrementing page and fetching more
  const handleLoadMore = useCallback(() => {
    if (!loading && canLoadMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, true);
    }
  }, [loading, canLoadMore, page, fetchNews]);

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
  }, [loading, canLoadMore, handleLoadMore]);

  // Add/remove scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Fetch news on category, keyword, or country change; reset page
  useEffect(() => {
    setPage(1);
    fetchNews(1, false);
  }, [category, keyword, country, fetchNews]);

  // Persist dark mode setting in localStorage and apply to body
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // Toggle dark mode state
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Clear search filters
  const handleClear = () => {
    setKeyword("");
    setCategory("general");
    setCountry("in"); // Reset to default country
  };

  return (
    <>
      <div className="header">
        <div className="container d-flex justify-between align-center">
          <h1>News Aggregator</h1>
          <button
            className="btn btn-outline"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            type="button"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      <div className="container mt-xl">
        {/* Search and filter bar */}
        <SearchBar
          category={category}
          setCategory={setCategory}
          country={country}
          setCountry={setCountry}
          keyword={keyword}
          setKeyword={setKeyword}
          categories={categories}
          onClear={handleClear}
        />

        {/* Loading spinner */}
        {loading && (
          <div className="d-flex justify-center">
            <div className="spinner" role="status" aria-label="Loading"></div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="text-center" style={{ color: "var(--color-accent)" }}>
            Error: {error}
          </p>
        )}

        {/* Articles list */}
        <ArticleList articles={articles} />

        {/* Inform user when no more results available */}
        {!canLoadMore && articles.length > 0 && !loading && (
          <p className="text-center mt-xl">No more articles available.</p>
        )}
      </div>
    </>
  );
}

export default App;
