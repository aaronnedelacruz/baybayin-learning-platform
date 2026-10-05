import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Moon,
  RefreshCw,
  Sun,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MultiQuiz from "../lib/MultiQuiz";
import type { QuizQuestion } from "../lib/MultiQuiz";
import "../styles/Home.css";
import "../styles/Lessonpages.css"; // shared lesson styles

type Theme = "light" | "dark";

function readTheme(): Theme {
  try {
    return localStorage.getItem("bb-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

const COMPLETE_KEY = "bb-lesson-2-complete";
const NEXT_MODULE_PATH = "/lessons/3";

function readComplete(): boolean {
  try {
    return localStorage.getItem(COMPLETE_KEY) === "1";
  } catch {
    return false;
  }
}

const STEPS = [
  "Introduction",
  "Built-in A",
  "The 14",
  "Look-alikes",
  "Practice",
  "Quiz",
  "Summary",
] as const;

const LAST_STEP = STEPS.length - 1;

const CONSONANTS = [
  { char: "ᜊ", sound: "ba", word: "bata" },
  { char: "ᜃ", sound: "ka", word: "kahoy" },
  { char: "ᜇ", sound: "da / ra", word: "dala" },
  { char: "ᜄ", sound: "ga", word: "gabi" },
  { char: "ᜑ", sound: "ha", word: "hangin" },
  { char: "ᜎ", sound: "la", word: "langit" },
  { char: "ᜋ", sound: "ma", word: "mata" },
  { char: "ᜈ", sound: "na", word: "nanay" },
  { char: "ᜅ", sound: "nga", word: "ngipin" },
  { char: "ᜉ", sound: "pa", word: "puno" },
  { char: "ᜐ", sound: "sa", word: "saging" },
  { char: "ᜆ", sound: "ta", word: "tao" },
  { char: "ᜏ", sound: "wa", word: "walis" },
  { char: "ᜌ", sound: "ya", word: "yakap" },
];

const BUILT_IN = ["ᜊ", "ᜋ", "ᜆ", "ᜎ"].map(
  (c) => CONSONANTS.find((k) => k.char === c)!,
);

const LOOKALIKES = [
  {
    a: { char: "ᜊ", sound: "ba", word: "bata" },
    b: { char: "ᜉ", sound: "pa", word: "puno" },
    tip: "Say them aloud. B is voiced, P is a puff of air.",
  },
  {
    a: { char: "ᜇ", sound: "da / ra", word: "dala" },
    b: { char: "ᜎ", sound: "la", word: "langit" },
    tip: "Tongue-tip sounds that are easy to mix up. Connect each with its word.",
  },
  {
    a: { char: "ᜈ", sound: "na", word: "nanay" },
    b: { char: "ᜅ", sound: "nga", word: "ngipin" },
    tip: "NGA is the ng in sing. NA is a plain n.",
  },
];

const FLASHCARDS = ["ᜋ", "ᜏ", "ᜅ", "ᜐ", "ᜇ", "ᜈ", "ᜌ", "ᜑ", "ᜆ", "ᜄ"].map(
  (c) => CONSONANTS.find((k) => k.char === c)!,
);

const QUESTIONS: QuizQuestion[] = [
  {
    prompt: 'Which character is "ka"?',
    options: [
      { label: "ᜋ", glyph: true },
      { label: "ᜃ", glyph: true },
      { label: "ᜏ", glyph: true },
    ],
    answer: 1,
    explain: "ᜃ is ka. ᜋ is ma and ᜏ is wa.",
  },
  {
    prompt: "Which sound does this character represent?",
    glyph: "ᜅ",
    options: [{ label: "na" }, { label: "nga" }, { label: "ga" }],
    answer: 1,
    explain: "ᜅ is nga, the ng sound in ngipin.",
  },
  {
    prompt: "Which word begins with ᜐ?",
    options: [{ label: "saging" }, { label: "bahay" }, { label: "ulan" }],
    answer: 0,
    explain: "ᜐ is sa, so it begins saging.",
  },
  {
    prompt: 'Which character is "ba"?',
    options: [
      { label: "ᜉ", glyph: true },
      { label: "ᜊ", glyph: true },
      { label: "ᜎ", glyph: true },
    ],
    answer: 1,
    explain: "ᜊ is ba. ᜉ is the look-alike pa.",
  },
  {
    prompt: "Which sound does this character represent?",
    glyph: "ᜇ",
    options: [{ label: "la" }, { label: "na" }, { label: "da / ra" }],
    answer: 2,
    explain: "ᜇ reads da or ra, as in dala.",
  },
  {
    prompt: 'Which character is "nga"?',
    options: [
      { label: "ᜈ", glyph: true },
      { label: "ᜄ", glyph: true },
      { label: "ᜅ", glyph: true },
    ],
    answer: 2,
    explain: "ᜅ is nga. ᜈ is na and ᜄ is ga.",
  },
];

const SUMMARY = [
  "I know Baybayin consonants are read as syllables.",
  "I understand every consonant includes an A sound.",
  "I can recognize the 14 consonants, including NGA.",
  "I can tell similar-looking characters apart.",
];

// Buttons inherit a dark text color from index.css, so set it for dark mode.
const CARD_BUTTON: CSSProperties = {
  color: "var(--text-h)",
  cursor: "pointer",
};
const CARD_SELECTED: CSSProperties = {
  ...CARD_BUTTON,
  borderColor: "var(--accent)",
  background: "var(--accent-bg)",
};
const FIT_GRID: CSSProperties = {
  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
};

function Lesson2() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(0);
  const [showPattern, setShowPattern] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(readComplete);
  const [menuOpen, setMenuOpen] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("bb-theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
    tabsRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [step]);

  const nextTheme: Theme = theme === "light" ? "dark" : "light";
  const progress = ((step + 1) / STEPS.length) * 100;

  function finish() {
    setCompleted(true);
    try {
      localStorage.setItem(COMPLETE_KEY, "1");
    } catch {}
    navigate(NEXT_MODULE_PATH);
  }

  function nextCard() {
    setCardIndex((i) => (i + 1) % FLASHCARDS.length);
    setRevealed(false);
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <section className="lp-section">
            <h2>Welcome to Katinig</h2>
            <p>
              In the last module you learned the three vowels, called{" "}
              <strong>Patinig</strong>. Now you will learn{" "}
              <strong>Katinig</strong>, the consonant characters of Baybayin.
            </p>
            <div className="lp-compare">
              <div className="lp-card">
                <h4>Latin alphabet</h4>
                <p className="lp-letters">K</p>
                <small>just the consonant</small>
              </div>
              <ArrowRight
                className="lp-compare-arrow"
                size={28}
                aria-hidden="true"
              />
              <div className="lp-card">
                <h4>Baybayin</h4>
                <p className="bb-card lp-letters-bb" aria-hidden="true">
                  ᜃ
                </p>
                <small>ka</small>
              </div>
            </div>
            <p>
              Unlike English letters, every Baybayin consonant is read together
              with the vowel A unless another mark changes it later. By the end
              you will recognize all fourteen and know how each one sounds.
            </p>
            <button className="lp-btn" onClick={() => setStep(1)}>
              Start lesson <ArrowRight size={18} aria-hidden="true" />
            </button>
          </section>
        );

      case 1:
        return (
          <section className="lp-section">
            <h2>The built-in A</h2>
            <p>Look at these four characters and say each one out loud.</p>
            <div className="lp-vowels">
              {BUILT_IN.map((k) => (
                <article className="lp-card" key={k.char}>
                  <div className="bb-card lp-glyph" aria-hidden="true">
                    {k.char}
                  </div>
                  <h3>{k.sound}</h3>
                </article>
              ))}
            </div>
            <p style={{ marginTop: 18 }}>
              <strong>Do you notice the pattern?</strong>
            </p>
            <button
              className="lp-btn outline"
              onClick={() => setShowPattern((s) => !s)}
              aria-pressed={showPattern}
            >
              {showPattern ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
              {showPattern ? "Hide answer" : "Show answer"}
            </button>
            {showPattern && (
              <div
                className="lp-feedback is-correct"
                role="status"
                style={{ marginTop: 14 }}
              >
                Every character ends with the <strong>a</strong> sound. That is
                why ᜊ reads ba, never just b.
              </div>
            )}
          </section>
        );

      case 2: {
        const c = CONSONANTS[selected];
        return (
          <section className="lp-section">
            <h2>Meet the 14 consonants</h2>
            <p>Tap a card to see its sound in a real word.</p>
            <div
              className="lp-feedback"
              role="status"
              style={{ marginBottom: 16 }}
            >
              <span className="bb-inline" aria-hidden="true">
                {c.char}
              </span>{" "}
              reads <strong>{c.sound}</strong>, as in <strong>{c.word}</strong>.
            </div>
            <div className="lp-vowels" style={FIT_GRID}>
              {CONSONANTS.map((k, i) => (
                <button
                  key={k.char}
                  type="button"
                  className="lp-card"
                  style={i === selected ? CARD_SELECTED : CARD_BUTTON}
                  aria-pressed={i === selected}
                  aria-label={`${k.sound}, as in ${k.word}`}
                  onClick={() => setSelected(i)}
                >
                  <span className="bb-card lp-glyph" aria-hidden="true">
                    {k.char}
                  </span>
                  <strong>{k.sound}</strong>
                  <small>{k.word}</small>
                </button>
              ))}
            </div>
          </section>
        );
      }

      case 3:
        return (
          <section className="lp-section">
            <h2>Telling look-alikes apart</h2>
            <p>
              A few characters are easy to confuse at first. Compare each pair
              side by side.
            </p>
            {LOOKALIKES.map((pair) => (
              <div key={pair.a.char} style={{ marginBottom: 20 }}>
                <div className="lp-compare" style={{ marginBottom: 8 }}>
                  {[pair.a, pair.b].map((k, i) => (
                    <div key={k.char} style={{ display: "contents" }}>
                      {i === 1 && (
                        <span
                          className="lp-compare-arrow"
                          style={{ fontWeight: 700 }}
                        >
                          vs
                        </span>
                      )}
                      <div className="lp-card">
                        <span className="bb-card lp-glyph" aria-hidden="true">
                          {k.char}
                        </span>
                        <strong>{k.sound}</strong>
                        <small>{k.word}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <small>{pair.tip}</small>
              </div>
            ))}
            <p>
              Do not worry if these seem similar. You will recognize them
              naturally with practice.
            </p>
          </section>
        );

      case 4: {
        const card = FLASHCARDS[cardIndex];
        return (
          <section className="lp-section">
            <h2>Reading practice</h2>
            <p>
              Say the sound first, then check yourself. Card {cardIndex + 1} of{" "}
              {FLASHCARDS.length}.
            </p>
            <div className="lp-flash">
              <div className="bb-hero lp-flash-glyph" aria-hidden="true">
                {card.char}
              </div>
              <div className="lp-flash-answer" aria-live="polite">
                {revealed ? (
                  <>
                    <strong>{card.sound}</strong>
                    <small>as in {card.word}</small>
                  </>
                ) : (
                  <small>What sound does this character make?</small>
                )}
              </div>
              <div className="lp-row">
                <button
                  className="lp-btn"
                  onClick={() => setRevealed((r) => !r)}
                  aria-pressed={revealed}
                >
                  {revealed ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                  {revealed ? "Hide answer" : "Show answer"}
                </button>
                <button className="lp-btn outline" onClick={nextCard}>
                  <RefreshCw size={18} aria-hidden="true" /> Next card
                </button>
              </div>
            </div>
          </section>
        );
      }

      case 5:
        return (
          <section className="lp-section">
            <h2>Quick quiz</h2>
            <MultiQuiz questions={QUESTIONS} />
          </section>
        );

      default:
        return (
          <section className="lp-section">
            <h2>Module summary</h2>
            <ul className="lp-checks">
              {SUMMARY.map((s) => (
                <li key={s}>
                  <span className="lp-check" aria-hidden="true">
                    <Check size={16} />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
            {completed && (
              <p className="lp-done" role="status">
                Module 2 is complete.
              </p>
            )}
            <p>Next up is Kudlit, the mark that changes the vowel.</p>
          </section>
        );
    }
  }

  return (
    <div className="home lesson-page">
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

      <main className="lp-shell">
        <header className="lp-top">
          <div className="lp-toprow">
            <Link to="/lessons" className="lp-back">
              <ArrowLeft size={16} aria-hidden="true" /> Back to lessons
            </Link>
            <div className="lp-meta">
              <span className="lp-chip">Module 2</span>
              <span className="lp-chip">30 min</span>
              <span className="lp-chip">Beginner</span>
            </div>
          </div>
          <h1>Katinig</h1>
          <p className="lp-sub">
            Meet the 14 consonants. Every one already carries an a sound.
          </p>
          <div
            className="lp-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Lesson progress"
          >
            <div
              className="lp-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <div
          className="lp-tabs"
          role="tablist"
          aria-label="Lesson steps"
          ref={tabsRef}
        >
          {STEPS.map((label, i) => (
            <button
              key={label}
              role="tab"
              id={`lp-tab-${i}`}
              aria-selected={i === step}
              aria-controls="lp-panel"
              className={`lp-tab${i === step ? " active" : ""}`}
              onClick={() => setStep(i)}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className="lp-body lesson-content-body"
          id="lp-panel"
          role="tabpanel"
          aria-labelledby={`lp-tab-${step}`}
          ref={bodyRef}
          tabIndex={0}
        >
          {renderStep()}
        </div>

        <div className="lp-bar">
          <button
            className="lp-btn outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ChevronLeft size={18} aria-hidden="true" />
            <span className="lp-bar-label">Previous</span>
          </button>

          <span className="lp-indicator" aria-live="polite">
            Step {step + 1} of {STEPS.length}
            <span className="lp-indicator-name"> - {STEPS[step]}</span>
          </span>

          {step === LAST_STEP ? (
            <button className="lp-btn lp-bar-end" onClick={finish}>
              <span className="lp-bar-label">Next Module</span>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          ) : (
            <button
              className="lp-btn lp-bar-end"
              onClick={() => setStep((s) => Math.min(LAST_STEP, s + 1))}
            >
              <span className="lp-bar-label">Next</span>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default Lesson2;
