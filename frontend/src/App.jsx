import UrlShortener from "./components/UrlShortener";
import Analytics from "./components/Analytics";

function App() {
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          Cut<span>URL</span>
        </div>

        <div className="nav-links">
          <a href="#shortener">Shorten</a>
          <a href="#analytics">Analytics</a>
          <a
            href="https://github.com/dipannitasharma"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="container">

        <section className="hero">

          <div className="badge">
            <span className="badge-dot"></span>
            Simple. Fast. Shareable.
          </div>

          <h1>
            CUT THE URL.
            <br />
            <span>KEEP THE LINK.</span>
          </h1>

          <p>
            Create short, memorable links in seconds.
            Track every click with built-in analytics.
          </p>

        </section>

        {/* Main Dashboard */}
        <section className="dashboard">

          <div id="shortener">
            <UrlShortener />
          </div>

          <div id="analytics">
            <Analytics />
          </div>

        </section>

        

      </main>

    </div>
  );
}

export default App;