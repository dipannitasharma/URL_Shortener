import { useState } from "react";
import API_URL from "../api";

function Analytics() {
  const [statsCode, setStatsCode] = useState("");
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStats = async () => {
    setStatsError("");
    setStats(null);

    if (!statsCode.trim()) {
      setStatsError("Please enter a short code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/stats/${statsCode}`
      );

      const data = await response.json();

      if (!response.ok) {
        setStatsError(data.error || "Unable to fetch statistics.");
        return;
      }

      setStats(data);

    } catch (error) {
      setStatsError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">

      <div className="card-header">

        <div>
          <p className="eyebrow">LINK ANALYTICS</p>

          <h2>Track performance</h2>

          <p className="card-description">
            See clicks and details for your shortened link.
          </p>
        </div>

        <div className="card-icon">
          ↗
        </div>

      </div>

      <div className="form">

        <div className="input-group">

          <label>Short code</label>

          <input
            type="text"
            placeholder="Enter short code"
            value={statsCode}
            onChange={(e) => setStatsCode(e.target.value)}
          />

        </div>

        <button
          className="secondary-button"
          onClick={handleStats}
          disabled={loading}
        >
          {loading ? "Loading..." : "View analytics"}
          {!loading && <span>→</span>}
        </button>

        {statsError && (
          <div className="error">
            {statsError}
          </div>
        )}

        {stats && (
          <div className="stats-result">

            <div className="click-stat">
              <span>Total clicks</span>

              <strong>
                {stats.clicks}
              </strong>
            </div>

            <div className="stat-grid">

              <div className="stat-item">
                <span>SHORT CODE</span>
                <strong>{stats.short_code}</strong>
              </div>

              <div className="stat-item">
                <span>CREATED</span>
                <strong>
                  {new Date(stats.created_at).toLocaleDateString()}
                </strong>
              </div>

            </div>

            <div className="original-url">

              <span>ORIGINAL URL</span>

              <a
                href={stats.long_url}
                target="_blank"
                rel="noreferrer"
              >
                {stats.long_url}
              </a>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default Analytics;