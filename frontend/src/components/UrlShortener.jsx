import { useState } from "react";
import API_URL from "../api";



function UrlShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    setError("");
    setShortUrl("");
    setCopied(false);

    if (!longUrl.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longUrl,
          customCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setShortUrl(data.shortUrl);

    } catch (error) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="card">

      <div className="card-header">

        <div>
          <p className="eyebrow">LINK GENERATOR</p>

          <h2>Shorten a URL</h2>

          <p className="card-description">
            Turn a long URL into a clean, shareable link.
          </p>
        </div>

        <div className="card-icon">
          ↗
        </div>

      </div>

      <div className="form">

        <div className="input-group">

          <label>Long URL</label>

          <input
            type="text"
            placeholder="https://example.com/very/long/url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />

        </div>

        <div className="input-group">

          <label>
            Custom alias
            <span>OPTIONAL</span>
          </label>

          <input
            type="text"
            placeholder="my-link"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
          />

        </div>

        <button
          className="primary-button"
          onClick={handleShorten}
          disabled={loading}
        >
          {loading ? "Creating..." : "Shorten URL"}
          {!loading && <span>→</span>}
        </button>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="result">

            <div className="result-label">
              YOUR SHORT LINK
            </div>

            <div className="short-url-box">

              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
              >
                {shortUrl}
              </a>

              <button
                className="copy-button"
                onClick={handleCopy}
              >
                {copied ? "Copied" : "Copy"}
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default UrlShortener;