import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function SearchResult() {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    axios
      .get(`http://127.0.0.1:8000/api/search?q=${query}`)
      .then((res) => {
        setResults(res.data);
      })
      .catch((err) => {
        console.error("Search failed:", err);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="container">
      <h2>Search results for: "{query}"</h2>
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {results.map((item) => (
            <div
              key={item.content_id} // ✅ dùng content_id thay vì id
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#fff",
              }}
            >
              <h3 style={{ minHeight: "48px", marginBottom: "8px" }}>
                <Link to={`/post/${item.content_id}`}>{item.title}</Link> {/* ✅ */}
              </h3>
              <p style={{ flexGrow: 1, minHeight: "60px", marginBottom: "10px" }}>
                {item.description}
              </p>
              {item.image && (
                <img
                  src={`http://127.0.0.1:8000/storage/${item.image}`}
                  alt={item.title}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    marginBottom: "10px",
                    objectFit: "cover",
                  }}
                />
              )}
              <small>
                Author: {item.author || "Unknown"}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResult;
