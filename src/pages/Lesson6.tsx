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

const COMPLETE_KEY = "bb-lesson-6-complete";

function readComplete(): boolean {
  try {
    return localStorage.getItem(COMPLETE_KEY) === "1";
  } catch {
    return false;
  }
}

const STEPS = [
  "Introduction",
  "Reading",
  "Writing",
  "Common Mistakes",
  "Final Challenge",
  "Summary",
] as const;

const LAST_STEP = STEPS.length - 1;

const RECAP = [
  { char: "ᜀ ᜁ ᜂ", name: "Patinig", text: "The vowels: A, I/E and U/O." },
  { char: "ᜊ ᜃ ᜐ", name: "Katinig", text: "Consonants, each with a built-in “a”." },
  { char: "ᜊᜒ ᜊᜓ", name: "Kudlit", text: "Marks that change the vowel." },
  { char: "ᜊ᜔", name: "Pamudpod", text: "The cross that removes the vowel." },
  { char: "ᜊᜌᜈ᜔", name: "Pantig", text: "Words are built one syllable at a time." },
];

const READING: {
  group: string;
  items: { baybayin: string; word: string; meaning: string }[];
}[] = [
  {
    group: "Everyday words",
    items: [
      { baybayin: "ᜊᜑᜌ᜔", word: "bahay", meaning: "house" },
      { baybayin: "ᜆᜓᜊᜒᜄ᜔", word: "tubig", meaning: "water" },
      { baybayin: "ᜀᜇᜏ᜔", word: "araw", meaning: "sun, day" },
    ],
  },
  {
    group: "Common names",
    items: [
      { baybayin: "ᜋᜇᜒᜌ", word: "Maria", meaning: "a common given name" },
      { baybayin: "ᜎᜒᜆᜓ", word: "Lito", meaning: "a common given name" },
    ],
  },
  {
    group: "Simple greetings",
    items: [
      { baybayin: "ᜋᜊᜓᜑᜌ᜔", word: "mabuhay", meaning: "welcome, long live" },
      { baybayin: "ᜐᜎᜋᜆ᜔", word: "salamat", meaning: "thank you" },
    ],
  },
];

interface WordPart {
  char: string;
  say: string;
  vowel?: boolean;
}

const WRITING: {
  word: string;
  meaning: string;
  baybayin: string;
  parts: WordPart[];
}[] = [
  {
    word: "mahal",
    meaning: "love, expensive",
    baybayin: "ᜋᜑᜎ᜔",
    parts: [
      { char: "ᜋ", say: "ma" },
      { char: "ᜑ", say: "ha" },
      { char: "ᜎ᜔", say: "l" },
    ],
  },
  {
    word: "kain",
    meaning: "eat",
    baybayin: "ᜃᜁᜈ᜔",
    parts: [
      { char: "ᜃ", say: "ka" },
      { char: "ᜁ", say: "i", vowel: true },
      { char: "ᜈ᜔", say: "n" },
    ],
  },
  {
    word: "aso",
    meaning: "dog",
    baybayin: "ᜀᜐᜓ",
    parts: [
      { char: "ᜀ", say: "a", vowel: true },
      { char: "ᜐᜓ", say: "so" },
    ],
  },
  {
    word: "isda",
    meaning: "fish",
    baybayin: "ᜁᜐ᜔ᜇ",
    parts: [
      { char: "ᜁ", say: "i", vowel: true },
      { char: "ᜐ᜔", say: "s" },
      { char: "ᜇ", say: "da" },
    ],
  },
  {
    word: "Pilipinas",
    meaning: "Philippines",
    baybayin: "ᜉᜒᜎᜒᜉᜒᜈᜐ᜔",
    parts: [
      { char: "ᜉᜒ", say: "pi" },
      { char: "ᜎᜒ", say: "li" },
      { char: "ᜉᜒ", say: "pi" },
      { char: "ᜈ", say: "na" },
      { char: "ᜐ᜔", say: "s" },
    ],
  },
];

const MISTAKES = [
  {
    title: "Wrong kudlit placement",
    wrong: { char: "ᜊᜓ", text: "Wanted “bi” but put the mark below, so it reads “bu”." },
    right: { char: "ᜊᜒ", text: "A mark above makes “bi”." },
    why: "Above means I or E. Below means U or O.",
  },
  {
    title: "Missing pamudpod",
    wrong: { char: "ᜊᜌᜈ", text: "Reads “bayana”." },
    right: { char: "ᜊᜌᜈ᜔", text: "Reads “bayan”." },
    why: "Without the cross, the last consonant keeps its “a”.",
  },
  {
    title: "Incorrect syllable break",
    wrong: { char: "ᜋᜄ᜔ᜀᜎᜒᜅ᜔", text: "Split as mag • a • ling." },
    right: { char: "ᜋᜄᜎᜒᜅ᜔", text: "Split as ma • ga • ling." },
    why: "Consonants attach to the vowel that follows them, not the one before.",
  },
  {
    title: "Look-alike characters",
    wrong: { char: "ᜉᜌᜈ᜔", text: "ᜉ is “pa”, so this reads “payan”." },
    right: { char: "ᜊᜌᜈ᜔", text: "ᜊ is “ba”, so this reads “bayan”." },
    why: "Pa (ᜉ) and ba (ᜊ) look similar. Check the shape before you read or write.",
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

const QUIZ: QuizQuestion[] = [
  {
    question: "Read this word.",
    glyph: "ᜋᜊᜓᜑᜌ᜔",
    options: [
      { text: "mabuhay", correct: true },
      { text: "mabuha" },
      { text: "mabihay" },
    ],
    why: "ma + bu + ha + y᜔ is mabuhay.",
  },
  {
    question: "Which spells “salamat”?",
    options: [
      { text: "ᜐᜎᜋᜆ᜔", glyph: true, say: "sa la ma t", correct: true },
      { text: "ᜐᜎᜋᜆ", glyph: true, say: "sa la ma ta" },
      { text: "ᜐᜎᜋᜒᜆ᜔", glyph: true, say: "sa la mi t" },
    ],
    why: "sa + la + ma + t᜔. The final T needs the pamudpod and ma has no kudlit.",
  },
  {
    question: "How do you read ᜊᜒ?",
    options: [{ text: "bi", correct: true }, { text: "bu" }, { text: "b" }],
    why: "A kudlit above the consonant changes “a” to “i”.",
  },
  {
    question: "Which spells “Maria”?",
    options: [
      { text: "ᜋᜇᜒᜌ", glyph: true, say: "ma ri ya", correct: true },
      { text: "ᜋᜇᜓᜌ", glyph: true, say: "ma ru ya" },
      { text: "ᜋᜇᜒᜌ᜔", glyph: true, say: "ma ri y" },
    ],
    why: "ma + ri (ᜇ with a kudlit above) + ya.",
  },
  {
    question: "What does this word mean?",
    glyph: "ᜆᜓᜊᜒᜄ᜔",
    options: [
      { text: "tubig (water)", correct: true },
      { text: "tabig" },
      { text: "tubi" },
    ],
    why: "tu + bi + g᜔ is tubig, which means water.",
  },
];

const SUMMARY = [
  "I can read and write the independent vowels (Patinig).",
  "I know each consonant (Katinig) carries a built-in “a”.",
  "I can change vowels with kudlit.",
  "I can end syllables with the pamudpod.",
  "I can break words into syllables (Pantig).",
  "I can read and write everyday Filipino words.",
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

function Lesson6() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [step, setStep] = useState(0);
  const [shown, setShown] = useState<Record<string, boolean>>({});
  const [writeIndex, setWriteIndex] = useState(0);
  const [writeRevealed, setWriteRevealed] = useState(false);
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

  function toggleWord(word: string) {
    setShown((s) => ({ ...s, [word]: !s[word] }));
  }

  function nextWord() {
    setWriteIndex((i) => (i + 1) % WRITING.length);
    setWriteRevealed(false);
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <section className="lp-section">
            <h2>Putting it all together</h2>
            <p>
              You now have every tool you need. In this final module you will
              use all five of them to read and write real Filipino words.
            </p>
            <div className="lp-words">
              {RECAP.map((r) => (
                <article className="lp-card" key={r.name}>
                  <div className="bb-card lp-glyph" aria-hidden="true">
                    {r.char}
                  </div>
                  <h3>{r.name}</h3>
                  <p>{r.text}</p>
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
            <h2>Reading practice</h2>
            <p>Try to read each word first, then reveal the answer.</p>
            {READING.map((g) => (
              <div key={g.group}>
                <h3>{g.group}</h3>
                <div className="lp-words">
                  {g.items.map((w) => (
                    <article className="lp-card" key={w.word}>
                      <div className="bb-card lp-glyph" aria-hidden="true">
                        {w.baybayin}
                      </div>
                      <div className="lp-flash-answer" aria-live="polite">
                        {shown[w.word] ? (
                          <>
                            <strong>{w.word}</strong>
                            <small>{w.meaning}</small>
                          </>
                        ) : (
                          <small>What does this say?</small>
                        )}
                      </div>
                      <button
                        className="lp-btn outline"
                        onClick={() => toggleWord(w.word)}
                        aria-pressed={!!shown[w.word]}
                      >
                        {shown[w.word] ? (
                          <EyeOff size={18} aria-hidden="true" />
                        ) : (
                          <Eye size={18} aria-hidden="true" />
                        )}
                        {shown[w.word] ? "Hide answer" : "Show answer"}
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>
        );

      case 2: {
        const w = WRITING[writeIndex];
        return (
          <section className="lp-section">
            <h2>Writing practice</h2>
            <p>
              Convert the word to Baybayin in your head, then check the
              breakdown. Word {writeIndex + 1} of {WRITING.length}.
            </p>
            <div className="lp-flash">
              <div className="lp-word-head">
                <h3>{w.word}</h3>
                <small>{w.meaning}</small>
              </div>
              <div className="lp-flash-answer" aria-live="polite">
                {writeRevealed ? (
                  <>
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
                  </>
                ) : (
                  <small>Split it into syllables, then reveal the answer.</small>
                )}
              </div>
              <div className="lp-row">
                <button
                  className="lp-btn"
                  onClick={() => setWriteRevealed((r) => !r)}
                  aria-pressed={writeRevealed}
                >
                  {writeRevealed ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                  {writeRevealed ? "Hide breakdown" : "Show breakdown"}
                </button>
                <button className="lp-btn outline" onClick={nextWord}>
                  <RefreshCw size={18} aria-hidden="true" /> Next word
                </button>
              </div>
            </div>
          </section>
        );
      }

      case 3:
        return (
          <section className="lp-section">
            <h2>Common mistakes</h2>
            <p>Four slip-ups to watch for when you read and write.</p>
            {MISTAKES.map((m) => (
              <div key={m.title}>
                <h3>{m.title}</h3>
                <div className="lp-compare">
                  <div className="lp-card">
                    <h4>Mistake</h4>
                    <p className="bb-card lp-letters-bb" aria-hidden="true">
                      {m.wrong.char}
                    </p>
                    <small>{m.wrong.text}</small>
                  </div>
                  <ArrowRight
                    className="lp-compare-arrow"
                    size={28}
                    aria-hidden="true"
                  />
                  <div className="lp-card">
                    <h4>Correct</h4>
                    <p className="bb-card lp-letters-bb" aria-hidden="true">
                      {m.right.char}
                    </p>
                    <small>{m.right.text}</small>
                  </div>
                </div>
                <div className="lp-feedback is-wrong">{m.why}</div>
              </div>
            ))}
          </section>
        );

      case 4:
        return (
          <section className="lp-section">
            <h2>Final challenge</h2>
            <QuizPanel questions={QUIZ} />
          </section>
        );

      default:
        return (
          <section className="lp-section">
            <h2>Course complete</h2>
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
            <p className="lp-done" role="status">
              {completed
                ? "Module 6 is complete. Mabuhay!"
                : "Mabuhay! You have reached the end of the course."}
            </p>
            <div className="lp-row">
              <Link to="/lessons" className="lp-btn" onClick={complete}>
                Return to Lessons
              </Link>
              <Link
                to="/keyboard"
                className="lp-btn outline"
                onClick={complete}
              >
                Try Keyboard Practice <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
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
              <span className="lp-chip">Module 6</span>
              <span className="lp-chip">30 min</span>
              <span className="lp-chip">Advanced</span>
            </div>
          </div>
          <h1>Pagsulat</h1>
          <p className="lp-sub">
            Bring everything together by reading and writing everyday Filipino
            words.
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
              to="/lessons"
              className="lp-btn lp-bar-end"
              onClick={complete}
            >
              <span className="lp-bar-label">Finish Course</span>
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

export default Lesson6;