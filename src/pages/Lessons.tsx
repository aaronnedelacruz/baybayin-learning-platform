import { useEffect, useState } from "react";
import { Moon, Sun, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Lessons.css";
import SkyBackground from "../lib/Skybackground.tsx";

type Theme = "light" | "dark";

function readTheme(): Theme {
  try {
    return localStorage.getItem("bb-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function Lessons() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [openLessons, setOpenLessons] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("bb-theme", theme);
    } catch {}
  }, [theme]);

  const nextTheme: Theme = theme === "light" ? "dark" : "light";

  const lessons = [
    {
      title: "Lesson 1 - Patinig (ᜉᜆᜒᜈᜒᜄ᜔) / Vowels",
      description:
        "The first step in learning Baybayin begins with its three vowel characters, known as Patinig. In this lesson, you'll learn how to recognize, pronounce, and read each one while understanding why three symbols are enough to represent the five modern Filipino vowels.",
      button: "Start Lesson",
      path: "/lessons/1",
    },
    {
      title: "Lesson 2 - Katinig (ᜃᜆᜒᜈᜒᜄ᜔) / Consonants",
      description:
        "Learn the fourteen Katinig (consonant) characters that make up the core of the Baybayin writing system. You'll discover that every consonant already carries the vowel A, recognize each character by sight, and practice reading them through familiar Filipino words.",
      button: "Start Lesson",
      path: "/lessons/2",
    },
    {
      title: "Lesson 3 - Kudlit (ᜃᜓᜇ᜔ᜎᜒᜆ᜔) / Vowel Marks",
      description:
        "Discover how the kudlit changes the sound of a Baybayin character. You'll learn how marks placed above or below a consonant replace its built-in A sound with I/E or U/O, allowing you to write many more syllables.",
      button: "Start Lesson",
      path: "/lessons/3",
    },
    {
      title: "Lesson 4 - Pamudpod (ᜉᜋᜓᜇ᜔ᜉᜓᜇ᜔) / Virama",
      description:
        "Learn how the pamudpod (virama) removes the built-in vowel from a consonant. By the end of this lesson, you'll be able to write syllables that end in consonants and understand how modern Baybayin represents words more accurately.",
      button: "Start Lesson",
      path: "/lessons/4",
    },
    {
      title: "Lesson 5 - Pantig (ᜉᜈ᜔ᜆᜒᜄ᜔) / Syllables",
      description:
        "Baybayin is written by syllables, not individual letters. In this lesson, you'll learn how to break Filipino words into syllables, apply the writing rules you've learned, and build complete Baybayin words one syllable at a time.",
      button: "Start Lesson",
      path: "/lessons/5",
    },
    {
      title:
        "Lesson 6 - Pagsulat ng mga Salita (ᜉᜄ᜔ᜐᜓᜎᜆ᜔ ᜈᜅ᜔ ᜋᜄ ᜐᜎᜒᜆ) / Writing Words",
      description:
        "Bring together everything you've learned throughout the course. You'll practice reading and writing complete words, names, and simple phrases while applying vowels, consonants, kudlit, and pamudpod with confidence.",
      button: "Start Lesson",
      path: "/lessons/6",
    },
  ];

  return (
    <div className="home lessons-page">
      <SkyBackground />
      <nav className="nav">
        <div className="nav-inner">
          <a
            href="https://aaronnedelacruz.github.io/baybayin-learning-platform/"
            className="brand"
          >
            <span className="bb-key" aria-hidden="true">
              ᜊᜌ᜔ᜊᜌᜒᜈ᜔
            </span>
            <span className="brand-name">Baybayin</span>
          </a>

          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
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
            className="nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>

          <button
            className="icon-btn"
            onClick={() => setTheme(nextTheme)}
            aria-label={`Switch to ${nextTheme} mode`}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </nav>

      <main className="lessons-main">
        <header className="lessons-header">
          <h1>Baybayin Lessons</h1>
          <p>Master reading and writing Baybayin step by step.</p>
        </header>

        <div className="lessons-content">
          {lessons.map((lesson, index) => {
            const open = openLessons.includes(index);

            return (
              <div
                className={`lesson-card${open ? " is-open" : ""}`}
                key={lesson.title}
              >
                <button
                  type="button"
                  className="lesson-header"
                  aria-expanded={open}
                  aria-controls={`lesson-panel-${index}`}
                  onClick={() =>
                    setOpenLessons((prev) =>
                      prev.includes(index)
                        ? prev.filter((i) => i !== index)
                        : [...prev, index],
                    )
                  }
                >
                  <span className="lesson-dot" aria-hidden="true" />
                  <span className="lesson-title">{lesson.title}</span>
                  <span className="lesson-toggle" aria-hidden="true">
                    <ChevronDown size={22} />
                  </span>
                </button>

                {open && (
                  <div className="lesson-preview" id={`lesson-panel-${index}`}>
                    <p>{lesson.description}</p>

                    <Link to={lesson.path} className="btn">
                      {lesson.button}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

export default Lessons;
