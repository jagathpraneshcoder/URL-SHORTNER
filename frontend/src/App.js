import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [longUrl, setLongUrl] = useState("");
  const [customShortUrl, setCustomShortUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/shorten", {
        longUrl,
        customShortUrl: customShortUrl || undefined,
      });

      setShortUrl(`http://localhost:5000/${response.data.shortUrl}`);
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🔗 URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
          style={{ padding: "10px", width: "300px", margin: "10px" }}
        />
        <input
          type="text"
          placeholder="Custom Short URL (Optional)"
          value={customShortUrl}
          onChange={(e) => setCustomShortUrl(e.target.value)}
          style={{ padding: "10px", width: "250px", margin: "10px" }}
        />
        <br />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Shorten
        </button>
      </form>
      {shortUrl && (
        <p>
          Short URL:{" "}
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  );
};

export default App;
