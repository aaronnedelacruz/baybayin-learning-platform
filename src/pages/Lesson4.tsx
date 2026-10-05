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

const COMPLETE_KEY = "bb-lesson-4-complete";

function readComplete(): boolean {
  try {
    return localStorage.getItem(COMPLETE_KEY) === "1";
  } catch {
    return false;
  }
}

const STEPS = [
  "Introduction",
  "Why Pamudpod?",
  "Using Pamudpod",
  "Practice",
  "Quiz",
  "Summary",
] as const;

const LAST_STEP = STEPS.length - 1;

const ENDINGS = [
  {
    char: "ᜊ᜔",
    sound: "B",
    text: "ᜊ (ba) without its built-in “a”.",
    words: "bus, tab",
  },
  {
    char: "ᜃ᜔",
    sound: "K",
    text: "ᜃ (ka) without its built-in “a”.",
    words: "anak, pak",
  },
  {
    char: "ᜐ᜔",
    sound: "S",
    text: "ᜐ (sa) without its built-in “a”.",
    words: "bus, gas",
  },
];

const FLASHCARDS = [
  { char: "ᜊ᜔", answer: "B", hint: "ᜊ = ba, minus the “a”" },
  { char: "ᜃ᜔", answer: "K", hint: "ᜃ = ka, minus the “a”" },
  { char: "ᜐ᜔", answer: "S", hint: "ᜐ = sa, minus the “a”" },
  { char: "ᜆ᜔", answer: "T", hint: "ᜆ = ta, minus the “a”" },
  { char: "ᜈ᜔", answer: "N", hint: "ᜈ = na, minus the “a”" },
  { char: "ᜎ᜔", answer: "L", hint: "ᜎ = la, minus the “a”" },
];

interface QuizOption {
  text: string;
  glyph?: boolean;
  say?: string;
  correct?: boolean;
}

interface QuizQuestion {
  question: string;
  glyph?: string;
  options: QuizOption[];
  why: string;
}

const QUIZ: QuizQuestion[] = [
  {
    question: "Which symbol represents the silent “T” sound in Baybayin?",
    options: [
      { text: "ᜆ", glyph: true, say: "ta" },
      { text: "ᜆ᜔", glyph: true, say: "t with pamudpod", correct: true },
      { text: "ᜆᜒ", glyph: true, say: "ti" },
    ],
    why: "ᜆ᜔ is ta with a pamudpod. The mark cancels the “a” and leaves only “t”.",
  },
  {
    question: "How do you read this symbol?",
    glyph: "ᜃ᜔",
    options: [{ text: "ka" }, { text: "k", correct: true }, { text: "ki" }],
    why: "The pamudpod removes the built-in “a”, so ᜃ᜔ is just “k”.",
  },
  {
    question: "What does the pamudpod do?",
    options: [
      { text: "Adds an “a”" },
      { text: "Removes the vowel", correct: true },
      { text: "Changes it to “i”" },
    ],
    why: "It cancels the vowel so a syllable can end on a consonant. Kudlit are what change the vowel.",
  },
];

const SUMMARY = [
  "Every Baybayin consonant carries a built-in “a”.",
  "The pamudpod cancels that vowel.",
  "ᜊ᜔ is B, ᜃ᜔ is K and ᜐ᜔ is S.",
  "Pamudpod lets a syllable end on a consonant.",
];

function QuizPanel({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Record<number, number>>({});

  const q = questions[index];
  const picked = picks[index] ?? null;
  const pickedOption = picked === null ? null : q.options[picked];
  const answeredAll = Object.keys(picks).length === questions.length;
  const score = questions.filter(
    (item, i) => picks[i] !== undefined && item.options[picks[i]].correct,
  ).length;

  return (
    <>
      <p>
        <small>
          Question {index + 1} of {questions.length}
        </small>
      </p>
      <p>{q.question}</p>
      {q.glyph && (
        <div className="lp-row">
          <div className="bb-card" aria-hidden="true">
            {q.glyph}
          </div>
        </div>
      )}
      <div className="lp-options" role="group" aria-label="Answer choices">
        {q.options.map((o, i) => {
          const state =
            picked === i ? (o.correct ? "is-correct" : "is-wrong") : "";
          return (
            <button
              key={o.text}
              className={`lp-option${o.glyph ? " bb-card" : ""} ${state}`}
              onClick={() => setPicks((p) => ({ ...p, [index]: i }))}
              aria-pressed={picked === i}
              aria-label={o.glyph ? `Option ${i + 1}: ${o.say}` : undefined}
            >
              {o.text}
              {picked === i &&
                (o.correct ? (
                  <Check
                    className="lp-option-icon"
                    size={20}
                    aria-hidden="true"
                  />
                ) : (
                  <X className="lp-option-icon" size={20} aria-hidden="true" />
                ))}
            </button>
          );
        })}
      </div>
      <div
        className={`lp-feedback ${
          pickedOption === null
            ? ""
            : pickedOption.correct
              ? "is-correct"
              : "is-wrong"
        }`}
        role="status"
      >
        {pickedOption === null
          ? "Pick an answer. You can change it, and you can move on at any time."
          : pickedOption.correct
            ? `Correct. ${q.why}`
            : `Not quite. ${q.why} Try another.`}
      </div>
      <div className="lp-row">
        {index > 0 && (
          <button
            className="lp-btn outline"
            onClick={() => setIndex((i) => i - 1)}
          >
            <ChevronLeft size={18} aria-hidden="true" /> Previous question
          </button>
        )}
        {index < questions.length - 1 && (
          <button
            className="lp-btn outline"
            onClick={() => setIndex((i) => i + 1)}
          >
            Next question <ChevronRight size={18} aria-hidden="true" />
          </button>
        )}
      </div>
      {answeredAll && (
        <p className="lp-done" role="status">
          You got {score} of {questions.length} right.
        </p>
      )}
    </>
  );
}

function Lesson4() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [step, setStep] = useState(0);
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
              In Baybayin every consonant already carries an “a”. To write a
              syllable that ends on a consonant, you add a small cross mark
              called the <strong>Pamudpod</strong>, also known as the virama.
            </p>
            <div className="bb-hero" aria-hidden="true">
              ᜊ᜔
            </div>
            <p>By the end of this lesson you will be able to:</p>
            <ul className="lp-list">
              <li>Explain why the pamudpod is needed.</li>
              <li>Read consonants that end a syllable.</li>
              <li>Tell ᜊ (ba) apart from ᜊ᜔ (b).</li>
            </ul>
            <button className="lp-btn" onClick={() => setStep(1)}>
              Start lesson <ArrowRight size={18} aria-hidden="true" />
            </button>
          </section>
        );

      case 1:
        return (
          <section className="lp-section">
            <h2>Why do we need Pamudpod?</h2>
            <p>
              Every Baybayin consonant is read with an “a” by default: ᜊ is “ba”
              and ᜃ is “ka”. That works for most syllables, but many Filipino
              words end on a consonant, so we need a way to cancel the “a”.
            </p>
            <div className="lp-compare">
              <div className="lp-card">
                <h4>Before</h4>
                <p className="bb-card lp-letters-bb" aria-hidden="true">
                  ᜊ
                </p>
                <small>Reads “ba”</small>
              </div>
              <ArrowRight
                className="lp-compare-arrow"
                size={28}
                aria-hidden="true"
              />
              <div className="lp-card">
                <h4>With pamudpod</h4>
                <p className="bb-card lp-letters-bb" aria-hidden="true">
                  ᜊ᜔
                </p>
                <small>Reads “b”</small>
              </div>
            </div>
            <p>
              The mark removes the vowel completely, so only the consonant sound
              is left.
            </p>
          </section>
        );

      case 2:
        return (
          <section className="lp-section">
            <h2>Using Pamudpod</h2>
            <p>
              The pamudpod attaches to the consonant it silences. Traditionally
              it is drawn as a cross (+), an x, or a short slash beside or under
              the character. In modern fonts you type it right after the
              consonant and it appears in the right place.
            </p>
            <div className="lp-vowels">
              {ENDINGS.map((e) => (
                <article className="lp-card" key={e.char}>
                  <div className="bb-card lp-glyph" aria-hidden="true">
                    {e.char}
                  </div>
                  <h3>{e.sound}</h3>
                  <p>{e.text}</p>
                  <small>Examples: {e.words}</small>
                </article>
              ))}
            </div>
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
                  <small>What consonant sound is this?</small>
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
            <h2>Quick quiz</h2>
            <QuizPanel questions={QUIZ} />
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
                Module 4 is complete.
              </p>
            )}
            <Link to="/lessons/5" className="lp-btn" onClick={complete}>
              Next Module: Pantig <ArrowRight size={18} aria-hidden="true" />
            </Link>
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
        {/* Top: header and progress */}
        <header className="lp-top">
          <div className="lp-toprow">
            <Link to="/lessons" className="lp-back">
              <ArrowLeft size={16} aria-hidden="true" /> Back to lessons
            </Link>
            <div className="lp-meta">
              <span className="lp-chip">Module 4</span>
              <span className="lp-chip">15 min</span>
              <span className="lp-chip">Beginner</span>
            </div>
          </div>
          <h1>Pamudpod</h1>
          <p className="lp-sub">
            Learn how Baybayin removes the built-in “a” sound to write
            consonant-ending syllables.
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
              to="/lessons/5"
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

export default Lesson4;
