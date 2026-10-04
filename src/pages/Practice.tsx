import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Practice.css";

type Theme = "light" | "dark";

function readTheme(): Theme {
  try {
    return localStorage.getItem("bb-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function Practice() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("bb-theme", theme);
    } catch {}
  }, [theme]);

  const nextTheme: Theme = theme === "light" ? "dark" : "light";

  return (
    <div className="home practice-page">
      <nav className="nav">
        <div className="nav-inner">
          <Link to="/" className="brand">
            <span className="bb-key" aria-hidden="true">
              ᜊᜌ᜔ᜊᜌᜒᜈ᜔
            </span>
            <span className="brand-name">Baybayin</span>
          </Link>

          <ul className="nav-links">
            <li>
              <Link to="/">About</Link>
            </li>
            <li>
              <Link to="/keyboard">Keyboard</Link>
            </li>
            <li>
              <Link to="/lessons">Lessons</Link>
            </li>
            <li>
              <Link to="/practice">Practice</Link>
            </li>
          </ul>

          <button
            className="icon-btn"
            onClick={() => setTheme(nextTheme)}
            aria-label={`Switch to ${nextTheme} mode`}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </nav>

      <main className="practice-main">
        <h1>Practice</h1>
        <p>Coming soon.</p>
      </main>

      <footer className="footer">
        <div className="section-inner">
          <span className="bb-inline" aria-hidden="true">
            ᜊᜌ᜔ᜊᜌᜒᜈ᜔
          </span>
          <span>Learn · Practice · Write</span>
        </div>
      </footer>
    </div>
  );
}

export default Practice;