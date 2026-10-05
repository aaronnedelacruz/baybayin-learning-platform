import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import "../styles/Home.css";
import { Link } from "react-router-dom";


type Theme = "light" | "dark";

interface KudlitForm {
  char: string;
  label: string;
  sound: string;
}

interface CourseModule {
  term: string;
  title: string;
  sample: string;
  summary: string;
  outcomes: string[];
  length: string;
}

interface PathStep {
  term: string;
  sample: string;
  text: string;
}

const KUDLIT: KudlitForm[] = [
  { char: "ᜃ", label: "No kudlit", sound: "ka" },
  { char: "ᜃᜒ", label: "Kudlit above", sound: "ki / ke" },
  { char: "ᜃᜓ", label: "Kudlit below", sound: "ku / ko" },
];

const MODULES: CourseModule[] = [
  {
    term: "Patinig",
    title: "The three vowels",
    sample: "ᜀ ᜁ ᜂ",
    summary:
      "Start with the only characters that stand alone as vowels, and hear why the script gets by with three.",
    outcomes: [
      "Read and say A, I/E and U/O",
      "Understand why E shares a symbol with I, and O with U",
      "Spot each vowel in words like araw, isda and ulan",
    ],
    length: "3 lessons · about 15 min",
  },
  {
    term: "Katinig",
    title: "The 14 consonants",
    sample: "ᜊ ᜃ ᜄ ᜅ",
    summary:
      "Every consonant character already carries an “a” sound. Meet them as syllables, not letters.",
    outcomes: [
      "Recognize all 14 consonant characters, including NGA",
      "Connect each one to its sound with example words",
      "Tell look-alike characters apart",
    ],
    length: "5 lessons · about 30 min",
  },
  {
    term: "Kudlit",
    title: "Changing the vowel",
    sample: "ᜃ ᜃᜒ ᜃᜓ",
    summary:
      "A small mark moves the vowel: above for I/E, below for U/O. This is where most beginners get stuck, so it is taught step by step.",
    outcomes: [
      "Place the kudlit above or below correctly",
      "Read any consonant with any of the three vowels",
      "Build all 5 vowel sounds from 3 forms",
    ],
    length: "4 lessons · about 25 min",
  },
  {
    term: "Pamudpod",
    title: "Ending a syllable with a consonant",
    sample: "ᜃ᜔",
    summary:
      "Some Filipino syllables end on a consonant. The modern pamudpod mark cancels the built-in “a”.",
    outcomes: [
      "Use the pamudpod for final consonants",
      "Break words apart, like bundok into bu-n-do-k",
      "Know how traditional writing left these out",
    ],
    length: "3 lessons · about 20 min",
  },
  {
    term: "Pantig",
    title: "Syllables and writing rules",
    sample: "ᜊᜑᜌ᜔",
    summary:
      "Baybayin is written by pantig (syllable), never letter by letter. Learn how to split a word before you write it.",
    outcomes: [
      "Divide Filipino words into syllables",
      "Avoid the most common mistakes",
      "Write punctuation marks",
    ],
    length: "4 lessons · about 25 min",
  },
  {
    term: "Pagsasanay",
    title: "Reading and writing real words",
    sample: "ᜀᜇᜏ᜔",
    summary:
      "Put it all together with everyday words, quizzes that track your streak, and the live keyboard.",
    outcomes: [
      "Read and write words such as araw, bahay and kaibigan",
      "Take quizzes on characters, sounds and spelling",
      "Check your own writing with the transliterator",
    ],
    length: "Ongoing · quizzes and practice sets",
  },
];

const PATH: PathStep[] = [
  {
    term: "Patinig",
    sample: "ᜀ",
    text: "Learn the 3 vowel characters. Everything else builds on them.",
  },
  {
    term: "Katinig",
    sample: "ᜃ",
    text: "Learn the 14 consonant characters. Each one reads as consonant + a.",
  },
  {
    term: "Kudlit",
    sample: "ᜃᜒ",
    text: "Add a mark above or below to change the vowel to i/e or u/o.",
  },
  {
    term: "Pamudpod",
    sample: "ᜃ᜔",
    text: "Add the cross mark to drop the vowel and end a syllable on a consonant.",
  },
  {
    term: "Pantig",
    sample: "ᜊᜑ",
    text: "Read and write whole words by syllable instead of by letter.",
  },
  {
    term: "Pagsulat",
    sample: "ᜋᜑᜎ᜔",
    text: "Write your own names and phrases, then check them against the transliterator.",
  },
];

const HERO_CHARS = ["ᜀ", "ᜊ", "ᜃ", "ᜄ", "ᜅ", "ᜋ"];

function readTheme(): Theme {
  // Day mode is the default, regardless of the device setting.
  try {
    return localStorage.getItem("bb-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function Home() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [kudlit, setKudlit] = useState<KudlitForm>(KUDLIT[0]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("bb-theme", theme);
    } catch {
      /* storage unavailable: theme still applies for this visit */
    }
  }, [theme]);

  const nextTheme: Theme = theme === "light" ? "dark" : "light";

  return (
    <div className="home">
      <nav className="nav">
        <div className="nav-inner">
          <a href="https://aaronnedelacruz.github.io/baybayin-learning-platform/" className="brand">
            <span className="bb-key" aria-hidden="true">ᜊᜌ᜔ᜊᜌᜒᜈ᜔</span>
            <span className="brand-name">Baybayin</span>
          </a>

          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li><Link to="/">About</Link></li>
            <li><Link to="/keyboard">Keyboard</Link></li>
            <li><Link to="/lessons">Lessons</Link></li>
            <li><Link to="/practice">Practice</Link></li>
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

      <header className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 className="display">Learn Baybayin</h1>
            <p className="lead">
              Read and write the script Filipinos used before printed books.
              Learn each character, practice with quizzes, and write your own
              words with a live keyboard.
            </p>
            <div className="btn-row">
              <a href="/Lessons" className="btn">Start learning</a>
              <a href="/keyboard" className="btn outline">Try the keyboard</a>
            </div>
            <p className="hero-facts secondary">
              17 basic characters · 6 lessons · practice at your own pace
            </p>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="sun" />
            {HERO_CHARS.map((c, i) => (
              <span
                key={c}
                className="orbit-char bb-key"
                style={{ ["--a" as string]: `${i * 60 - 90}deg` }}
              >
                {c}
              </span>
            ))}
            <span className="sun-word bb-output">ᜊᜌ᜔ᜊᜌᜒᜈ᜔</span>
          </div>
        </div>
        <div className="waves" aria-hidden="true" />
      </header>

      <section className="about" id="about">
        <div className="section-inner about-grid">
          <div>
            <h2>What is Baybayin?</h2>
            <p>
              Baybayin is one of the pre-colonial writing systems of the
              Philippines. It is an abugida: each character stands for a
              consonant with a built-in “a” sound, and a small mark called a
              kudlit changes that vowel.
            </p>
            <p className="secondary">
              Tap a form to see how a kudlit changes the sound of ka.
            </p>
            <div className="kudlit-readout" aria-live="polite">
              <span className="bb-hero">{kudlit.char}</span>
              <span className="kudlit-text">
                <strong>{kudlit.sound}</strong>
                <span className="secondary">{kudlit.label}</span>
              </span>
            </div>
          </div>

          <div className="kudlit-buttons" role="group" aria-label="Kudlit forms">
            {KUDLIT.map((k) => (
              <button
                key={k.char}
                className="kudlit-btn bb-card"
                aria-pressed={k.char === kudlit.char}
                aria-label={`${k.label}: ${k.sound}`}
                onClick={() => setKudlit(k)}
              >
                {k.char}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="course" id="course">
        <div className="section-inner course-grid">
          <div className="course-intro">
            <h2>A course you can finish in a weekend</h2>
            <p>
              Six short modules take you from your first vowel to writing whole
              words. Open any module to see what you will be able to do by the
              end of it.
            </p>
            <h4>Included with every module</h4>
            <ul className="includes">
              <li>Tap-to-hear pronunciation</li>
              <li>Quizzes on characters, sounds and spelling</li>
              <li>Progress and daily streak tracking</li>
              <li>A live keyboard and transliterator</li>
            </ul>
          </div>

          <ol className="modules">
            {MODULES.map((m, i) => (
              <li key={m.term}>
                <details open={i === 0}>
                  <summary>
                    <span className="mod-num">{i + 1}</span>
                    <span className="mod-title">
                      <strong>{m.term}</strong>
                      <span className="secondary">{m.title}</span>
                    </span>
                    <span className="mod-sample bb-key" aria-hidden="true">
                      {m.sample}
                    </span>
                  </summary>
                  <div className="mod-body">
                    <p>{m.summary}</p>
                    <ul>
                      {m.outcomes.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                    <span className="caption">{m.length}</span>
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="path" id="path">
        <div className="section-inner">
          <h2>How the script builds up</h2>
          <p className="path-lead">
            Baybayin follows a small set of rules. Learn them in this order and
            each step only adds one new idea.
          </p>
          <ol className="steps">
            {PATH.map((s, i) => (
              <li key={s.term}>
                <span className="bb-card step-char" aria-hidden="true">
                  {s.sample}
                </span>
                <h4>
                  <span className="step-num">{i + 1}</span> {s.term}
                </h4>
                <p className="secondary">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="btn-row">
            <a href="/keyboard" className="btn outline">Try the keyboard first</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="section-inner">
          <span className="bb-inline" aria-hidden="true">ᜊᜌ᜔ᜊᜌᜒᜈ᜔</span>
          <span>Learn · Practice · Write</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;