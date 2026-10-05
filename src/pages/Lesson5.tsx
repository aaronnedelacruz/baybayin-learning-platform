import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Moon,
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

const COMPLETE_KEY = "bb-lesson-5-complete";

function readComplete(): boolean {
  try {
    return localStorage.getItem(COMPLETE_KEY) === "1";
  } catch {
    return false;
  }
}

const STEPS = [
  "Introduction",
  "Writing Rules",
  "Building Words",
  "Practice",
  "Quiz",
  "Summary",
] as const;

const LAST_STEP = STEPS.length - 1;

const SYLLABLE_EXAMPLES = [
  { word: "bayani", parts: "ba • ya • ni", pattern: "CV • CV • CV" },
  { word: "magaling", parts: "ma • ga • ling", pattern: "CV • CV • CVC" },
  { word: "tahanan", parts: "ta • ha • nan", pattern: "CV • CV • CVC" },
];

const RULES = [
  {
    char: "ᜊ",
    title: "One symbol per syllable",
    text: "Each symbol is a consonant plus “a”. ᜊ is the whole syllable “ba”.",
  },
  {
    char: "ᜀ ᜁ ᜂ",
    title: "Independent vowels",
    text: "A syllable that is only a vowel gets its own symbol: A, I/E and U/O.",
  },
  {
    char: "ᜊᜒ ᜊᜓ",
    title: "Kudlit change the vowel",
    text: "A mark above makes I/E (ᜊᜒ is bi). A mark below makes U/O (ᜊᜓ is bu).",
  },
  {
    char: "ᜊ᜔",
    title: "Pamudpod ends a syllable",
    text: "The cross mark removes the vowel, so a syllable can end on a consonant.",
  },
];

interface WordPart {
  char: string;
  say: string;
  vowel?: boolean;
}

const WORDS: {
  word: string;
  syllables: string;
  baybayin: string;
  parts: WordPart[];
  note: string;
}[] = [
  {
    word: "Bayan",
    syllables: "ba • ya • n",
    baybayin: "ᜊᜌᜈ᜔",
    parts: [
      { char: "ᜊ", say: "ba" },
      { char: "ᜌ", say: "ya" },
      { char: "ᜈ᜔", say: "n" },
    ],
    note: "The final N is ᜈ with a pamudpod. Without it the word would read “bayana”.",
  },
  {
    word: "Tubig",
    syllables: "tu • bi • g",
    baybayin: "ᜆᜓᜊᜒᜄ᜔",
    parts: [
      { char: "ᜆᜓ", say: "tu" },
      { char: "ᜊᜒ", say: "bi" },
      { char: "ᜄ᜔", say: "g" },
    ],
    note: "A kudlit below makes tu. A kudlit above makes bi. The pamudpod ends the word.",
  },
  {
    word: "Mabuti",
    syllables: "ma • bu • ti",
    baybayin: "ᜋᜊᜓᜆᜒ",
    parts: [
      { char: "ᜋ", say: "ma" },
      { char: "ᜊᜓ", say: "bu" },
      { char: "ᜆᜒ", say: "ti" },
    ],
    note: "Three syllables, three symbols. The kudlit do the vowel work.",
  },
  {
    word: "Ilog",
    syllables: "i • lo • g",
    baybayin: "ᜁᜎᜓᜄ᜔",
    parts: [
      { char: "ᜁ", say: "i", vowel: true },
      { char: "ᜎᜓ", say: "lo" },
      { char: "ᜄ᜔", say: "g" },
    ],
    note: "The word starts with a vowel, so it begins with the independent vowel ᜁ.",
  },
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

const PRACTICE: QuizQuestion[] = [
  {
    question: "Which is the correct syllable breakdown of “salamat”?",
    options: [
      { text: "sal • a • mat" },
      { text: "sa • la • mat", correct: true },
      { text: "sa • lam • at" },
    ],
    why: "Filipino syllables usually start with a consonant: sa • la • mat.",
  },
  {
    question: "Which is the correct syllable breakdown of “bahay”?",
    options: [
      { text: "ba • hay", correct: true },
      { text: "bah • ay" },
      { text: "b • a • hay" },
    ],
    why: "The H joins the vowel after it (ha) and the Y closes the last syllable: ba • hay.",
  },
  {
    question: "Which is the correct syllable breakdown of “mabuti”?",
    options: [
      { text: "mab • u • ti" },
      { text: "ma • but • i" },
      { text: "ma • bu • ti", correct: true },
    ],
    why: "Each consonant joins the vowel that follows it: ma • bu • ti.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    question: "Which Baybayin spells “bayan”?",
    options: [
      { text: "ᜊᜌᜈ᜔", glyph: true, say: "ba ya n", correct: true },
      { text: "ᜊᜌᜈ", glyph: true, say: "ba ya na" },
      { text: "ᜊᜌ᜔ᜈ", glyph: true, say: "ba y na" },
    ],
    why: "ba + ya + n᜔. The final N needs a pamudpod, otherwise it reads “na”.",
  },
  {
    question: "How many symbols are needed to write “tubig” (ᜆᜓᜊᜒᜄ᜔)?",
    options: [{ text: "2" }, { text: "3", correct: true }, { text: "5" }],
    why: "tu • bi • g is three syllables, so three symbols. Kudlit and pamudpod are marks, not extra symbols.",
  },
  {
    question: "How is the final “g” in “tubig” written?",
    options: [
      { text: "ᜄ", glyph: true, say: "ga" },
      { text: "ᜄ᜔", glyph: true, say: "g with pamudpod", correct: true },
      { text: "ᜄᜒ", glyph: true, say: "gi" },
    ],
    why: "A final consonant is its base symbol plus a pamudpod: ᜄ᜔.",
  },
];

const SUMMARY = [
  "Baybayin is written one syllable at a time.",
  "Vowel-only syllables use independent vowel symbols.",
  "Kudlit change the vowel: above for I/E, below for U/O.",
  "Pamudpod removes the vowel for consonant endings.",
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
                  <Check className="lp-option-icon" size={20} aria-hidden="true" />
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

function Lesson5() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [step, setStep] = useState(0);
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

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <section className="lp-section">
            <h2>Thinking in syllables</h2>
            <p>
              Baybayin has no separate letter for every sound. Each symbol is a
              whole <strong>Pantig</strong> (syllable), so the first skill is
              breaking a Filipino word into syllables. Most are a consonant and
              a vowel (CV), or a consonant, a vowel and a consonant (CVC).
            </p>
            <div className="lp-words">
              {SYLLABLE_EXAMPLES.map((e) => (
                <article className="lp-card" key={e.word}>
                  <h4>{e.word}</h4>
                  <h3>{e.parts}</h3>
                  <small>{e.pattern}</small>
                </article>
              ))}
            </div>
            <button className="lp-btn" onClick={() => setStep(1)}>
              Start lesson <ArrowRight size={18} aria-hidden="true" />
            </button>
          </section>
        );

      case 1:
        return (
          <section className="lp-section">
            <h2>Writing rules</h2>
            <p>Four rules cover almost everything you will write.</p>
            <div className="lp-words">
              {RULES.map((r) => (
                <article className="lp-card" key={r.title}>
                  <div className="bb-card lp-glyph" aria-hidden="true">
                    {r.char}
                  </div>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                </article>
              ))}
            </div>
          </section>
        );

      case 2:
        return (
          <section className="lp-section">
            <h2>Building words</h2>
            <p>
              Each word goes from Latin letters to syllables to Baybayin
              symbols. The highlighted part is an independent vowel.
            </p>
            <div className="lp-words">
              {WORDS.map((w) => (
                <article className="lp-card lp-word" key={w.word}>
                  <div className="lp-word-head">
                    <h3>{w.word}</h3>
                    <small>{w.syllables}</small>
                  </div>
                  <div
                    className="bb-card lp-word-bb"
                    aria-label={`${w.word} in Baybayin`}
                  >
                    {w.baybayin}
                  </div>
                  <ol className="lp-parts">
                    {w.parts.map((p, i) => (
                      <li
                        key={`${p.char}-${i}`}
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
            <p>
              Spoken syllables and written symbols do not always line up.
              “Tahanan” is spoken ta • ha • nan, but it is written ta + ha + na
              + n᜔ (ᜆᜑᜈᜈ᜔), because the final N is a consonant with a pamudpod.
            </p>
          </section>
        );

      case 3:
        return (
          <section className="lp-section">
            <h2>Practice</h2>
            <p>Pick the correct syllable breakdown for each word.</p>
            <QuizPanel questions={PRACTICE} />
          </section>
        );

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
                Module 5 is complete.
              </p>
            )}
            <Link to="/lessons/6" className="lp-btn" onClick={complete}>
              Next Module: Pagsulat <ArrowRight size={18} aria-hidden="true" />
            </Link>
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
              <span className="lp-chip">Module 5</span>
              <span className="lp-chip">20 min</span>
              <span className="lp-chip">Intermediate</span>
            </div>
          </div>
          <h1>Pantig</h1>
          <p className="lp-sub">
            Instead of writing letter by letter, Baybayin is written one
            syllable at a time.
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
              to="/lessons/6"
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

export default Lesson5;