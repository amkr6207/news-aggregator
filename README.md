# News Aggregator

A personalized news aggregator web application built with React and Vite.
It fetches news articles based on selected categories or keyword search using the NewsAPI.

---

## Features

- **Country Selection**: Read news from **India**, USA, UK, Australia, and Canada.
- **Smart Search**: Filter by category or search by keyword with a large, user-friendly search bar.
- **Clear Filters**: Easily reset your search and country selection with a single click.
- **Dark Mode**: Fully supported dark/light theme with persistent preference.
- **Responsive**: Optimized for all device sizes (mobile, tablet, desktop).
- **Infinite Scroll**: Seamlessly load more articles as you scroll.

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amkr6207/news-aggregator.git
   cd news-aggregator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Create a `.env` file in the root directory.
   - Add your NewsAPI key:
     ```env
     VITE_NEWS_API_KEY=your_api_key_here
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit:
   `http://localhost:5173`
