import { useEffect, useRef, useState } from "react";
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
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Lessonpages.css";

type Theme = "light" | "dark";

function readTheme(): Theme {
  try {
    return localStorage.getItem("bb-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

const COMPLETE_KEY = "bb-lesson-1-complete";

function readComplete(): boolean {
  try {
    return localStorage.getItem(COMPLETE_KEY) === "1";
  } catch {
    return false;
  }
}

const STEPS = [
  "Introduction",
  "Patinig",
  "Why Three?",
  "Practice",
  "Examples",
  "Quiz",
  "Summary",
] as const;

const LAST_STEP = STEPS.length - 1;

const VOWELS = [
  {
    char: "ᜀ",
    sound: "A",
    text: "Represents the vowel sound A.",
    words: "araw, anak, aso",
  },
  {
    char: "ᜁ",
    sound: "I / E",
    text: "One character is used for both I and E.",
    words: "isda, ilaw, elepante",
  },
  {
    char: "ᜂ",
    sound: "U / O",
    text: "One character is used for both U and O.",
    words: "ulan, oras, uod",
  },
];

const FLASHCARDS = [
  { char: "ᜀ", answer: "A", hint: "as in araw" },
  { char: "ᜁ", answer: "I or E", hint: "as in ilaw or elepante" },
  { char: "ᜂ", answer: "U or O", hint: "as in ulan or oras" },
];

interface WordPart {
  char: string;
  say: string;
  vowel?: boolean;
}

const WORDS: {
  word: string;
  meaning: string;
  baybayin: string;
  parts: WordPart[];
  note: string;
}[] = [
  {
    word: "araw",
    meaning: "sun, day",
    baybayin: "ᜀᜇᜏ᜔",
    parts: [
      { char: "ᜀ", say: "a", vowel: true },
      { char: "ᜇ", say: "ra" },
      { char: "ᜏ᜔", say: "w" },
    ],
    note: "The word starts with the vowel A, so it begins with ᜀ. ᜇ reads as da or ra.",
  },
  {
    word: "ilaw",
    meaning: "light",
    baybayin: "ᜁᜎᜏ᜔",
    parts: [
      { char: "ᜁ", say: "i", vowel: true },
      { char: "ᜎ", say: "la" },
      { char: "ᜏ᜔", say: "w" },
    ],
    note: "The vowel I is written with ᜁ, the same character used for E.",
  },
  {
    word: "ulan",
    meaning: "rain",
    baybayin: "ᜂᜎᜈ᜔",
    parts: [
      { char: "ᜂ", say: "u", vowel: true },
      { char: "ᜎ", say: "la" },
      { char: "ᜈ᜔", say: "n" },
    ],
    note: "The vowel U is written with ᜂ, the same character used for O.",
  },
];

const QUIZ = {
  question: "Which character represents the vowel A?",
  options: [
    {
      char: "ᜀ",
      correct: true,
      feedback: "Correct. ᜀ is the only character for the vowel A.",
    },
    {
      char: "ᜁ",
      correct: false,
      feedback: "Not quite. ᜁ stands for both I and E. Try another.",
    },
    {
      char: "ᜂ",
      correct: false,
      feedback: "Not quite. ᜂ stands for both U and O. Try another.",
    },
  ],
};

const SUMMARY = [
  "I know the three Baybayin vowel symbols.",
  "I understand that I and E share one symbol.",
  "I understand that U and O share one symbol.",
  "I can recognize Patinig in simple Filipino words.",
];

function Lesson1() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [step, setStep] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [completed, setCompleted] = useState(readComplete);

  const bodyRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("bb-theme", theme);
    } catch {}
  }, [theme]);

  // New step: scroll the content back to the top and keep the active tab in view.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
    tabsRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [step]);

  const nextTheme: Theme = theme === "light" ? "dark" : "light";
  const progress = ((step + 1) / STEPS.length) * 100;

  function complete() {
    setCompleted(true);
    try {
      localStorage.setItem(COMPLETE_KEY, "1");
    } catch {}
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
            <h2>Welcome</h2>
            <p>
              Baybayin begins with only three vowel characters called{" "}
              <strong>Patinig</strong>. They stand for every vowel sound in the
              writing system and are the base for everything else you will
              learn.
            </p>
            <p>By the end of this lesson you will be able to:</p>
            <ul className="lp-list">
              <li>Recognize each of the three vowel characters.</li>
              <li>Say which sounds each one stands for.</li>
              <li>Spot them in simple Filipino words.</li>
            </ul>
            <button className="lp-btn" onClick={() => setStep(1)}>
              Start lesson <ArrowRight size={18} aria-hidden="true" />
            </button>
          </section>
        );

      case 1:
        return (
          <section className="lp-section">
            <h2>The three vowels</h2>
            <div className="lp-vowels">
              {VOWELS.map((v) => (
                <article className="lp-card" key={v.char}>
                  <div className="bb-card lp-glyph" aria-hidden="true">
                    {v.char}
                  </div>
                  <h3>{v.sound}</h3>
                  <p>{v.text}</p>
                  <small>Examples: {v.words}</small>
                </article>
              ))}
            </div>
          </section>
        );

      case 2:
        return (
          <section className="lp-section">
            <h2>Why are there only three vowels?</h2>
            <div className="lp-compare">
              <div className="lp-card">
                <h4>Modern Filipino alphabet</h4>
                <p className="lp-letters">A E I O U</p>
                <small>5 vowels</small>
              </div>
              <ArrowRight
                className="lp-compare-arrow"
                size={28}
                aria-hidden="true"
              />
              <div className="lp-card">
                <h4>Baybayin</h4>
                <p className="bb-card lp-letters-bb" aria-hidden="true">
                  ᜀ ᜁ ᜂ
                </p>
                <small>3 vowels</small>
              </div>
            </div>
            <p>
              Baybayin joins the sounds <strong>I</strong> and{" "}
              <strong>E</strong> into one character, and <strong>U</strong> and{" "}
              <strong>O</strong> into another. Readers pick the right sound from
              the word they are reading.
            </p>
          </section>
        );

      case 3: {
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
                    <strong>{card.answer}</strong>
                    <small>{card.hint}</small>
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

      case 4:
        return (
          <section className="lp-section">
            <h2>Vowels in real words</h2>
            <p>
              Each word below is split into its syllables. The highlighted part
              is the vowel you just learned.
            </p>
            <div className="lp-words">
              {WORDS.map((w) => (
                <article className="lp-card lp-word" key={w.word}>
                  <div className="lp-word-head">
                    <h3>{w.word}</h3>
                    <small>{w.meaning}</small>
                  </div>
                  <div
                    className="bb-card lp-word-bb"
                    aria-label={`${w.word} in Baybayin`}
                  >
                    {w.baybayin}
                  </div>
                  <ol className="lp-parts">
                    {w.parts.map((p) => (
                      <li
                        key={p.char}
                        className={p.vowel ? "is-vowel" : undefined}
                      >
                        <span className="bb-key" aria-hidden="true">
                          {p.char}
                        </span>
                        <small>{p.say}</small>
                      </li>
                    ))}
                  </ol>
                  <p className="lp-note">{w.note}</p>
                </article>
              ))}
            </div>
          </section>
        );

      case 5:
        return (
          <section className="lp-section">
            <h2>Quick quiz</h2>
            <p>{QUIZ.question}</p>
            <div
              className="lp-options"
              role="group"
              aria-label="Answer choices"
            >
              {QUIZ.options.map((o, i) => {
                const state =
                  picked === i ? (o.correct ? "is-correct" : "is-wrong") : "";
                return (
                  <button
                    key={o.char}
                    className={`lp-option bb-card ${state}`}
                    onClick={() => setPicked(i)}
                    aria-pressed={picked === i}
                    aria-label={`Option ${i + 1}`}
                  >
                    {o.char}
                    {picked === i &&
                      (o.correct ? (
                        <Check
                          className="lp-option-icon"
                          size={20}
                          aria-hidden="true"
                        />
                      ) : (
                        <X
                          className="lp-option-icon"
                          size={20}
                          aria-hidden="true"
                        />
                      ))}
                  </button>
                );
              })}
            </div>
            <div
              className={`lp-feedback ${
                picked === null
                  ? ""
                  : QUIZ.options[picked].correct
                    ? "is-correct"
                    : "is-wrong"
              }`}
              role="status"
            >
              {picked === null
                ? "Pick an answer. You can change it, and you can move on at any time."
                : QUIZ.options[picked].feedback}
            </div>
          </section>
        );

      default:
        return (
          <section className="lp-section">
            <h2>Lesson summary</h2>
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
                Module 1 is complete.
              </p>
            )}
          </section>
        );
    }
  }

  return (
    <div className="home lesson-page">
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

      <main className="lp-shell">
        {/* Top: header and progress */}
        <header className="lp-top">
          <div className="lp-toprow">
            <Link to="/lessons" className="lp-back">
              <ArrowLeft size={16} aria-hidden="true" /> Back to lessons
            </Link>
            <div className="lp-meta">
              <span className="lp-chip">Module 1</span>
              <span className="lp-chip">15 min</span>
              <span className="lp-chip">Beginner</span>
            </div>
          </div>
          <h1>Patinig</h1>
          <p className="lp-sub">
            Learn the three vowel symbols that form the foundation of Baybayin.
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

        {/* Middle: tabs, then the only scrolling area */}
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

        {/* Bottom: fixed pagination bar */}
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
            <Link
              to="/lessons/2"
              className="lp-btn lp-bar-end"
              onClick={complete}
            >
              <span className="lp-bar-label">Next Module</span>
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
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

export default Lesson1;
