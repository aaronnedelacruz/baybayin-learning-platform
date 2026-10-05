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
type Vowel = "a" | "e" | "i" | "o" | "u";
type Placement = "above" | "below" | "none";

function readTheme(): Theme {
  try {
    return localStorage.getItem("bb-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

const COMPLETE_KEY = "bb-lesson-3-complete";
const NEXT_MODULE_PATH = "/lessons/4";

function readComplete(): boolean {
  try {
    return localStorage.getItem(COMPLETE_KEY) === "1";
  } catch {
    return false;
  }
}

const STEPS = [
  "Introduction",
  "Builder",
  "Placement",
  "Practice",
  "Words",
  "Quiz",
  "Summary",
] as const;

const LAST_STEP = STEPS.length - 1;

// Three forms, five sounds: i and e share the upper kudlit, o and u the lower.
const MARK: Record<Vowel, string> = { a: "", e: "ᜒ", i: "ᜒ", o: "ᜓ", u: "ᜓ" };
const PLACEMENT: Record<Vowel, Placement> = {
  a: "none",
  e: "above",
  i: "above",
  o: "below",
  u: "below",
};
const VOWELS: Vowel[] = ["a", "e", "i", "o", "u"];

const CONSONANTS = [
  { char: "ᜊ", onset: "b" },
  { char: "ᜃ", onset: "k" },
  { char: "ᜇ", onset: "d", alt: "r" },
  { char: "ᜄ", onset: "g" },
  { char: "ᜑ", onset: "h" },
  { char: "ᜎ", onset: "l" },
  { char: "ᜋ", onset: "m" },
  { char: "ᜈ", onset: "n" },
  { char: "ᜅ", onset: "ng" },
  { char: "ᜉ", onset: "p" },
  { char: "ᜐ", onset: "s" },
  { char: "ᜆ", onset: "t" },
  { char: "ᜏ", onset: "w" },
  { char: "ᜌ", onset: "y" },
];

const RULES = [
  {
    glyph: "ᜃ",
    sound: "KA",
    title: "No kudlit",
    text: "The consonant alone keeps its built-in a.",
  },
  {
    glyph: "ᜃᜒ",
    sound: "KI / KE",
    title: "Upper kudlit",
    text: "A mark above the consonant changes a to i or e.",
  },
  {
    glyph: "ᜃᜓ",
    sound: "KU / KO",
    title: "Lower kudlit",
    text: "A mark below the consonant changes a to u or o.",
  },
];

const PLACE_TARGETS: {
  base: string;
  target: string;
  answer: Placement;
  result: string;
}[] = [
  { base: "ᜋ", target: "mu", answer: "below", result: "ᜋᜓ" },
  { base: "ᜆ", target: "ti", answer: "above", result: "ᜆᜒ" },
  { base: "ᜉ", target: "pa", answer: "none", result: "ᜉ" },
  { base: "ᜎ", target: "le", answer: "above", result: "ᜎᜒ" },
  { base: "ᜐ", target: "so", answer: "below", result: "ᜐᜓ" },
  { base: "ᜄ", target: "ga", answer: "none", result: "ᜄ" },
];

const PLACE_LABEL: Record<Placement, string> = {
  above: "Mark above",
  below: "Mark below",
  none: "No mark",
};

const FLASHCARDS = [
  { char: "ᜐᜒ", answer: "SI / SE", hint: "sa with an upper kudlit" },
  { char: "ᜃᜓ", answer: "KU / KO", hint: "ka with a lower kudlit" },
  { char: "ᜋᜒ", answer: "MI / ME", hint: "ma with an upper kudlit" },
  { char: "ᜎᜓ", answer: "LU / LO", hint: "la with a lower kudlit" },
  { char: "ᜉ", answer: "PA", hint: "no kudlit, so the built-in a stays" },
  { char: "ᜆᜒ", answer: "TI / TE", hint: "ta with an upper kudlit" },
  { char: "ᜄᜓ", answer: "GU / GO", hint: "ga with a lower kudlit" },
  { char: "ᜊᜓ", answer: "BU / BO", hint: "ba with a lower kudlit" },
];

interface WordPart {
  char: string;
  say: string;
  modified?: boolean;
}

const WORDS: {
  word: string;
  meaning: string;
  baybayin: string;
  parts: WordPart[];
  note: string;
}[] = [
  {
    word: "pusa",
    meaning: "cat",
    baybayin: "ᜉᜓᜐ",
    parts: [
      { char: "ᜉᜓ", say: "pu", modified: true },
      { char: "ᜐ", say: "sa" },
    ],
    note: "pu is ᜉ (pa) with a lower kudlit. sa keeps its built-in a.",
  },
  {
    word: "sila",
    meaning: "they",
    baybayin: "ᜐᜒᜎ",
    parts: [
      { char: "ᜐᜒ", say: "si", modified: true },
      { char: "ᜎ", say: "la" },
    ],
    note: "si is ᜐ (sa) with an upper kudlit.",
  },
  {
    word: "kuko",
    meaning: "nail",
    baybayin: "ᜃᜓᜃᜓ",
    parts: [
      { char: "ᜃᜓ", say: "ku", modified: true },
      { char: "ᜃᜓ", say: "ko", modified: true },
    ],
    note: "ku and ko share one form, so the word is written with the same character twice.",
  },
];

const QUESTIONS: QuizQuestion[] = [
  {
    prompt: "Which symbol represents the sound BI or BE?",
    options: [
      { label: "ᜊ", glyph: true },
      { label: "ᜊᜒ", glyph: true },
      { label: "ᜊᜓ", glyph: true },
    ],
    answer: 1,
    explain: "The kudlit above changes BA to BI or BE.",
  },
  {
    prompt: "Which symbol reads KU or KO?",
    options: [
      { label: "ᜃᜒ", glyph: true },
      { label: "ᜃ", glyph: true },
      { label: "ᜃᜓ", glyph: true },
    ],
    answer: 2,
    explain: "The kudlit below changes KA to KU or KO.",
  },
  {
    prompt: "Where does the kudlit go for the sound TI?",
    options: [{ label: "Above" }, { label: "Below" }, { label: "No mark" }],
    answer: 0,
    explain: "I and E use the upper kudlit.",
  },
  {
    prompt: "Which sound does this character represent?",
    glyph: "ᜎᜓ",
    options: [{ label: "la" }, { label: "li / le" }, { label: "lu / lo" }],
    answer: 2,
    explain: "The kudlit below gives U or O, so ᜎᜓ reads LU or LO.",
  },
  {
    prompt: "With three forms, how many vowel sounds can one consonant make?",
    options: [{ label: "2" }, { label: "3" }, { label: "5" }],
    answer: 2,
    explain:
      "a, e, i, o and u: no mark gives a, the upper mark gives i or e, the lower mark gives u or o.",
  },
  {
    prompt: "Which word is written ᜉᜓᜐ?",
    options: [{ label: "pusa" }, { label: "pasa" }, { label: "sila" }],
    answer: 0,
    explain: "ᜉᜓ is pu and ᜐ is sa, so the word is pusa.",
  },
];

const SUMMARY = [
  "I can place the kudlit above or below the consonant.",
  "I know the upper kudlit gives I or E and the lower kudlit gives U or O.",
  "I can read any consonant with any of the three vowels.",
  "I can build all 5 vowel sounds from 3 forms.",
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
const CHIP: CSSProperties = { ...CARD_BUTTON, padding: "6px 0" };
const CHIP_SELECTED: CSSProperties = { ...CARD_SELECTED, padding: "6px 0" };
const CHIP_GRID: CSSProperties = {
  gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))",
  gap: 8,
};

function Lesson3() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(readComplete);
  const [menuOpen, setMenuOpen] = useState(false);

  // Builder
  const [consonant, setConsonant] = useState(1);
  const [vowel, setVowel] = useState<Vowel>("a");

  // Placement exercise
  const [placeIndex, setPlaceIndex] = useState(0);
  const [placeChoice, setPlaceChoice] = useState<Placement | null>(null);

  // Flashcards
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  // Word cards with a syllable toggle
  const [shown, setShown] = useState<string[]>([]);

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

  function nextTarget() {
    setPlaceIndex((i) => (i + 1) % PLACE_TARGETS.length);
    setPlaceChoice(null);
  }

  function toggleWord(word: string) {
    setShown((s) =>
      s.includes(word) ? s.filter((w) => w !== word) : [...s, word],
    );
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <section className="lp-section">
            <h2>Welcome to Kudlit</h2>
            <p>
              Every consonant you learned reads with a built-in{" "}
              <strong>a</strong>. A small mark called a <strong>kudlit</strong>{" "}
              moves that vowel: above for I or E, below for U or O. This is
              where most beginners get stuck, so you will build it up one step
              at a time.
            </p>
            <div className="lp-vowels">
              {RULES.map((r) => (
                <article className="lp-card" key={r.title}>
                  <div className="bb-card lp-glyph" aria-hidden="true">
                    {r.glyph}
                  </div>
                  <h3>{r.sound}</h3>
                  <h4>{r.title}</h4>
                  <p>{r.text}</p>
                </article>
              ))}
            </div>
            <p style={{ marginTop: 18 }}>
              You will be able to place the kudlit correctly, read any consonant
              with any vowel, and build all 5 vowel sounds from just 3 forms.
            </p>
            <button className="lp-btn" onClick={() => setStep(1)}>
              Start lesson <ArrowRight size={18} aria-hidden="true" />
            </button>
          </section>
        );

      case 1: {
        const c = CONSONANTS[consonant];
        const result = c.char + MARK[vowel];
        const sound = `${c.onset}${vowel}`;
        return (
          <section className="lp-section">
            <h2>Kudlit builder</h2>
            <p>
              Pick a consonant and a vowel sound, then see how it is written.
            </p>

            <h4 style={{ margin: "0 0 8px" }}>1. Consonant</h4>
            <div className="lp-vowels" style={CHIP_GRID}>
              {CONSONANTS.map((k, i) => (
                <button
                  key={k.char}
                  type="button"
                  className="lp-card bb-key"
                  style={i === consonant ? CHIP_SELECTED : CHIP}
                  aria-pressed={i === consonant}
                  aria-label={`${k.onset}a`}
                  onClick={() => setConsonant(i)}
                >
                  {k.char}
                </button>
              ))}
            </div>

            <h4 style={{ margin: "20px 0 8px" }}>2. Vowel sound</h4>
            <div className="lp-row" style={{ justifyContent: "flex-start" }}>
              {VOWELS.map((v) => (
                <button
                  key={v}
                  className={`lp-btn${v === vowel ? "" : " outline"}`}
                  style={{ minWidth: 52 }}
                  aria-pressed={v === vowel}
                  onClick={() => setVowel(v)}
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="lp-flash" style={{ marginTop: 20 }}>
              <div className="bb-hero lp-flash-glyph" aria-hidden="true">
                {result}
              </div>
              <div className="lp-flash-answer" aria-live="polite">
                <strong>{sound.toUpperCase()}</strong>
                <small>
                  {PLACEMENT[vowel] === "none"
                    ? "No kudlit: the built-in a stays."
                    : `Kudlit ${PLACEMENT[vowel]} the consonant.`}
                  {c.alt && ` ᜇ also reads ${c.alt}${vowel}.`}
                </small>
              </div>
            </div>

            <h4 style={{ margin: "20px 0 8px" }}>Three forms, five sounds</h4>
            <ol
              className="lp-parts"
              style={{ justifyContent: "flex-start", flexWrap: "wrap" }}
            >
              {VOWELS.map((v) => (
                <li key={v} className={v === vowel ? "is-vowel" : undefined}>
                  <span className="bb-key" aria-hidden="true">
                    {c.char + MARK[v]}
                  </span>
                  <small>{c.onset + v}</small>
                </li>
              ))}
            </ol>
          </section>
        );
      }

      case 2: {
        const t = PLACE_TARGETS[placeIndex];
        const answered = placeChoice !== null;
        const correct = placeChoice === t.answer;
        return (
          <section className="lp-section">
            <h2>Place the kudlit</h2>
            <p>
              Write <strong>{`"${t.target}"`}</strong>. Start from the plain
              consonant and decide where the mark goes. Item {placeIndex + 1} of{" "}
              {PLACE_TARGETS.length}.
            </p>
            <div className="lp-flash">
              <div className="bb-hero lp-flash-glyph" aria-hidden="true">
                {answered && correct ? t.result : t.base}
              </div>
              <div
                className="lp-row"
                role="group"
                aria-label="Kudlit placement"
              >
                {(["above", "below", "none"] as Placement[]).map((p) => {
                  const chosen = placeChoice === p;
                  const style: CSSProperties | undefined = chosen
                    ? {
                        borderColor:
                          p === t.answer ? "var(--lp-ok)" : "var(--lp-bad)",
                        background:
                          p === t.answer
                            ? "var(--lp-ok-bg)"
                            : "var(--lp-bad-bg)",
                        color: "var(--text-h)",
                      }
                    : undefined;
                  return (
                    <button
                      key={p}
                      className="lp-btn outline"
                      style={style}
                      aria-pressed={chosen}
                      onClick={() => setPlaceChoice(p)}
                    >
                      {PLACE_LABEL[p]}
                    </button>
                  );
                })}
              </div>
              <div
                className={`lp-feedback ${answered ? (correct ? "is-correct" : "is-wrong") : ""}`}
                role="status"
                style={{ width: "100%", boxSizing: "border-box" }}
              >
                {!answered
                  ? "Choose where the kudlit goes. You can change your choice."
                  : correct
                    ? `Correct. ${t.target} is written ${t.result}.`
                    : `Not quite. ${t.target.slice(-1).toUpperCase()} uses ${
                        t.answer === "none"
                          ? "no mark"
                          : `the ${t.answer === "above" ? "upper" : "lower"} kudlit`
                      }. Try another.`}
              </div>
              <button className="lp-btn outline" onClick={nextTarget}>
                <RefreshCw size={18} aria-hidden="true" /> Next sound
              </button>
            </div>
          </section>
        );
      }

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
            <h2>Words with kudlit</h2>
            <p>
              Guess the syllables first, then tap to check. Highlighted
              syllables use a kudlit.
            </p>
            <div className="lp-words">
              {WORDS.map((w) => {
                const open = shown.includes(w.word);
                return (
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
                    <button
                      className="lp-btn outline"
                      style={{ marginBottom: 12 }}
                      aria-expanded={open}
                      onClick={() => toggleWord(w.word)}
                    >
                      {open ? (
                        <EyeOff size={18} aria-hidden="true" />
                      ) : (
                        <Eye size={18} aria-hidden="true" />
                      )}
                      {open ? "Hide syllables" : "Show syllables"}
                    </button>
                    {open && (
                      <>
                        <ol className="lp-parts">
                          {w.parts.map((p, i) => (
                            <li
                              key={`${p.char}-${i}`}
                              className={p.modified ? "is-vowel" : undefined}
                            >
                              <span className="bb-key" aria-hidden="true">
                                {p.char}
                              </span>
                              <small>{p.say}</small>
                            </li>
                          ))}
                        </ol>
                        <p className="lp-note">{w.note}</p>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        );

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
                Module 3 is complete.
              </p>
            )}
            <p>
              Next up is Pamudpod, the mark that ends a syllable on a consonant.
            </p>
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
              <span className="lp-chip">Module 3</span>
              <span className="lp-chip">25 min</span>
              <span className="lp-chip">Beginner</span>
            </div>
          </div>
          <h1>Kudlit</h1>
          <p className="lp-sub">
            A small mark moves the vowel: above for I or E, below for U or O.
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

export default Lesson3;
