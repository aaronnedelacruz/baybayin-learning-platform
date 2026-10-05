import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import "../styles/Home.css";
import "../styles/Practice.css";

/* ------------------------------------------------------------------ */
/* Types & dataset                                                     */
/* ------------------------------------------------------------------ */

type Theme = "light" | "dark";
type Difficulty = "easy" | "medium" | "hard";
type Mode = "flashcard" | "quiz";

export type PracticeItem = {
  id: string;
  baybayin: string;
  latin: string; // primary correct answer
  altAnswers?: string[];
  hint: string; // never contains the full answer
  difficulty: Difficulty;
};

const countSyllables = (breakdown: string) => breakdown.split(/[-\s]+/).filter(Boolean).length;

/** Hint for words and phrases: size and first letter, never the full answer. */
const sizeHint = (latin: string, breakdown: string, phrase: boolean) => {
  const syl = countSyllables(breakdown);
  const words = latin.split(" ").length;
  const sylText = `${syl} syllable${syl === 1 ? "" : "s"}`;
  const start = `starts with “${latin[0]}”`;
  return phrase ? `${words} words, ${sylText}, ${start}` : `${sylText}, ${start}`;
};

const easy = (id: string, baybayin: string, latin: string, hint: string, altAnswers?: string[]): PracticeItem => ({
  id: `e-${id}`, baybayin, latin, hint, altAnswers, difficulty: "easy",
});
const word = (id: string, baybayin: string, latin: string, breakdown: string, altAnswers?: string[]): PracticeItem => ({
  id: `m-${id}`, baybayin, latin, hint: sizeHint(latin, breakdown, false), altAnswers, difficulty: "medium",
});
const phrase = (id: string, baybayin: string, latin: string, breakdown: string): PracticeItem => ({
  id: `h-${id}`, baybayin, latin, hint: sizeHint(latin, breakdown, true), difficulty: "hard",
});

export const PRACTICE_ITEMS: PracticeItem[] = [
  /* Easy: one syllable (pantig) */
  easy("a", "ᜀ", "a", "A vowel. The first letter of the alphabet."),
  easy("ba", "ᜊ", "ba", "Starts with “b”."),
  easy("ka", "ᜃ", "ka", "Starts with “k”."),
  easy("da", "ᜇ", "da", "Starts with “d”. This character is also used for “r”.", ["ra"]),
  easy("ga", "ᜄ", "ga", "Starts with “g”."),
  easy("ha", "ᜑ", "ha", "Starts with “h”."),
  easy("la", "ᜎ", "la", "Starts with “l”."),
  easy("ma", "ᜋ", "ma", "Starts with “m”."),
  easy("na", "ᜈ", "na", "Starts with “n”."),
  easy("nga", "ᜅ", "nga", "Three letters: n, g, a."),
  easy("pa", "ᜉ", "pa", "Starts with “p”."),
  easy("sa", "ᜐ", "sa", "Starts with “s”."),
  easy("ta", "ᜆ", "ta", "Starts with “t”."),
  easy("wa", "ᜏ", "wa", "Starts with “w”."),
  easy("ya", "ᜌ", "ya", "Starts with “y”."),
  easy("pu", "ᜉᜓ", "pu", "Kudlit below: a u/o sound. Starts with “p”.", ["po"]),
  easy("si", "ᜐᜒ", "si", "Kudlit above: an i/e sound. Starts with “s”.", ["se"]),
  easy("ki", "ᜃᜒ", "ki", "Kudlit above: an i/e sound. Starts with “k”.", ["ke"]),
  easy("mu", "ᜋᜓ", "mu", "Kudlit below: a u/o sound. Starts with “m”.", ["mo"]),

  /* Medium: one word (salita) */
  word("bata", "ᜊᜆ", "bata", "ba-ta"),
  word("pusa", "ᜉᜓᜐ", "pusa", "pu-sa"),
  word("bayan", "ᜊᜌᜈ᜔", "bayan", "ba-yan"),
  word("araw", "ᜀᜇᜏ᜔", "araw", "a-raw"),
  word("bahay", "ᜊᜑᜌ᜔", "bahay", "ba-hay"),
  word("mata", "ᜋᜆ", "mata", "ma-ta"),
  word("tubig", "ᜆᜓᜊᜒᜄ᜔", "tubig", "tu-big"),
  word("kamay", "ᜃᜋᜌ᜔", "kamay", "ka-may"),
  word("buwan", "ᜊᜓᜏᜈ᜔", "buwan", "bu-wan"),
  word("langit", "ᜎᜅᜒᜆ᜔", "langit", "la-ngit"),
  word("lupa", "ᜎᜓᜉ", "lupa", "lu-pa"),
  word("aso", "ᜀᜐᜓ", "aso", "a-so", ["asu"]),
  word("kain", "ᜃᜁᜈ᜔", "kain", "ka-in", ["kaen"]),
  word("ilog", "ᜁᜎᜓᜄ᜔", "ilog", "i-log"),
  word("tao", "ᜆᜀᜓ", "tao", "ta-o", ["tau"]),
  word("bituin", "ᜊᜒᜆᜓᜁᜈ᜔", "bituin", "bi-tu-in"),
  word("salamat", "ᜐᜎᜋᜆ᜔", "salamat", "sa-la-mat"),

  /* Hard: phrases and sentences (pangungusap) */
  phrase("mahalkita", "ᜋᜑᜎ᜔ ᜃᜒᜆ", "mahal kita", "ma-hal ki-ta"),
  phrase("gabi", "ᜋᜄᜈ᜔ᜇᜅ᜔ ᜄᜊᜒ", "magandang gabi", "ma-gan-dang ga-bi"),
  phrase("umaga", "ᜋᜄᜈ᜔ᜇᜅ᜔ ᜂᜋᜄ", "magandang umaga", "ma-gan-dang u-ma-ga"),
  phrase("hapon", "ᜋᜄᜈ᜔ᜇᜅ᜔ ᜑᜉᜓᜈ᜔", "magandang hapon", "ma-gan-dang ha-pon"),
  phrase("salamatpo", "ᜐᜎᜋᜆ᜔ ᜉᜓ", "salamat po", "sa-la-mat po"),
  phrase("kumusta", "ᜃᜓᜋᜓᜐ᜔ᜆ ᜃ", "kumusta ka", "ku-mus-ta ka"),
  phrase("ingat", "ᜁᜅ᜔ᜀᜆ᜔ ᜃ", "ingat ka", "i-ngat ka"),
  phrase("sinoka", "ᜐᜒᜈᜓ ᜃ", "sino ka", "si-no ka"),
  phrase("paalam", "ᜉᜀᜎᜋ᜔ ᜈ", "paalam na", "pa-a-lam na"),
  phrase("kainnatayo", "ᜃᜁᜈ᜔ ᜈ ᜆᜌᜓ", "kain na tayo", "ka-in na ta-yo"),
  phrase("akoaymasaya", "ᜀᜃᜓ ᜀᜌ᜔ ᜋᜐᜌ", "ako ay masaya", "a-ko ay ma-sa-ya"),
  phrase("akoaypilipino", "ᜀᜃᜓ ᜀᜌ᜔ ᜉᜒᜎᜒᜉᜒᜈᜓ", "ako ay pilipino", "a-ko ay pi-li-pi-no"),
  phrase("angaraw", "ᜀᜅ᜔ ᜀᜇᜏ᜔ ᜀᜌ᜔ ᜋᜁᜈᜒᜆ᜔", "ang araw ay mainit", "ang a-raw ay ma-i-nit"),
  phrase("angbata", "ᜀᜅ᜔ ᜊᜆ ᜀᜌ᜔ ᜋᜐᜌ", "ang bata ay masaya", "ang ba-ta ay ma-sa-ya"),
  phrase("mahalkobayan", "ᜋᜑᜎ᜔ ᜃᜓ ᜀᜅ᜔ ᜊᜌᜈ᜔", "mahal ko ang bayan", "ma-hal ko ang ba-yan"),
  phrase("mabuhay", "ᜋᜊᜓᜑᜌ᜔ ᜀᜅ᜔ ᜉᜒᜎᜒᜉᜒᜈᜐ᜔", "mabuhay ang pilipinas", "ma-bu-hay ang pi-li-pi-nas"),
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const DIFFICULTIES: { id: Difficulty; label: string; sub: string }[] = [
  { id: "easy", label: "Easy", sub: "Pantig" },
  { id: "medium", label: "Medium", sub: "Salita" },
  { id: "hard", label: "Hard", sub: "Pangungusap" },
];

/**
 * Baybayin does not distinguish i/e, u/o or d/r, so answers are compared after
 * lowercasing, trimming, collapsing spaces and folding those pairs.
 */
const normalize = (s: string) =>
  s.toLowerCase().trim().replace(/\s+/g, " ").replace(/o/g, "u").replace(/e/g, "i").replace(/r/g, "d");

const isCorrect = (item: PracticeItem, input: string) => {
  const guess = normalize(input);
  return !!guess && [item.latin, ...(item.altAnswers ?? [])].some((a) => normalize(a) === guess);
};

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Next unseen item. When the pool is exhausted the queue resets (never repeating the current card). */
function nextItem(pool: PracticeItem[], used: Set<string>, current?: PracticeItem) {
  let nextUsed = new Set(used);
  let fresh = pool.filter((i) => !used.has(i.id));
  if (fresh.length === 0) {
    nextUsed = new Set(current ? [current.id] : []);
    fresh = pool.filter((i) => i.id !== current?.id);
    if (fresh.length === 0) fresh = pool;
  }
  const item = pickRandom(fresh);
  nextUsed.add(item.id);
  return { item, used: nextUsed };
}

/** 1 correct + 3 distractors from the same difficulty, preferring similar length. */
function buildOptions(item: PracticeItem, pool: PracticeItem[]): string[] {
  const correctKey = normalize(item.latin);
  const closest = pool
    .filter((p) => p.id !== item.id && normalize(p.latin) !== correctKey)
    .sort(
      (a, b) =>
        Math.abs(a.latin.length - item.latin.length) - Math.abs(b.latin.length - item.latin.length) ||
        Math.random() - 0.5
    )
    .slice(0, 6);

  const seen = new Set([correctKey]);
  const distractors: string[] = [];
  for (const c of shuffle(closest)) {
    const k = normalize(c.latin);
    if (seen.has(k)) continue;
    seen.add(k);
    distractors.push(c.latin);
    if (distractors.length === 3) break;
  }
  return shuffle([item.latin, ...distractors]);
}

function readTheme(): Theme {
  try {
    return localStorage.getItem("bb-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

function Prompt({ item }: { item: PracticeItem }) {
  const long = item.difficulty === "hard";
  return (
    <div className="pr-prompt">
      <div className={`bb-hero pr-glyph${long ? " is-long" : ""}`} lang="tl-Tglg">
        {item.baybayin}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mode 1: endless flashcards                                          */
/* ------------------------------------------------------------------ */

function FlashcardMode({ difficulty }: { difficulty: Difficulty }) {
  const pool = useMemo(() => PRACTICE_ITEMS.filter((i) => i.difficulty === difficulty), [difficulty]);

  // state.used is the usedItemIds set for this session
  const [state, setState] = useState(() => nextItem(pool, new Set()));
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const { item } = state;

  const advance = useCallback(() => {
    window.clearTimeout(timer.current);
    setState((s) => nextItem(pool, s.used, s.item));
    setInput("");
    setStatus("idle");
    setShowHint(false);
  }, [pool]);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (status === "idle") inputRef.current?.focus();
  }, [status, item.id]);

  const check = () => {
    if (status !== "idle" || !input.trim()) return;
    if (isCorrect(item, input)) {
      setStatus("correct");
      timer.current = window.setTimeout(advance, 1200);
    } else {
      setStatus("wrong");
    }
  };

  const retry = () => {
    setInput("");
    setStatus("idle");
  };

  const feedback =
    status === "correct"
      ? { kind: "correct", text: "Correct. Next card coming up." }
      : status === "wrong"
        ? {
            kind: "wrong",
            text: `Not quite. The answer is “${item.latin}”${
              item.altAnswers?.length ? ` (also ${item.altAnswers.map((a) => `“${a}”`).join(", ")})` : ""
            }.`,
          }
        : showHint
          ? { kind: "hint", text: item.hint }
          : { kind: "", text: "" };

  return (
    <div className="pr-card pr-card--flash" data-state={status === "idle" ? undefined : status}>
      <Prompt item={item} />

      <div className="pr-answer">
        <label htmlFor="pr-answer">Type the Latin spelling</label>
        <input
          id="pr-answer"
          ref={inputRef}
          className="pr-input"
          type="text"
          value={input}
          disabled={status !== "idle"}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder={difficulty === "hard" ? "e.g. mahal kita" : difficulty === "medium" ? "e.g. bata" : "e.g. ba"}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
        />

        <div className="pr-feedback" role="status" aria-live="polite" data-kind={feedback.kind}>
          {feedback.text}
        </div>

        <div className="pr-actions">
          {status === "idle" && (
            <>
              <button className="pr-btn primary" onClick={check} disabled={!input.trim()}>
                Check answer
              </button>
              <button className="pr-btn outline" onClick={() => setShowHint((v) => !v)} aria-pressed={showHint}>
                {showHint ? "Hide hint" : "Show hint"}
              </button>
              <button className="pr-btn outline" onClick={advance}>
                Skip
              </button>
            </>
          )}
          {status === "wrong" && (
            <>
              <button className="pr-btn primary" onClick={retry}>
                Try again
              </button>
              <button className="pr-btn outline" onClick={advance}>
                Next card
              </button>
            </>
          )}
          {status === "correct" && (
            <button className="pr-btn primary" onClick={advance}>
              Next card
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mode 2: multiple-choice quiz                                        */
/* ------------------------------------------------------------------ */

function QuizMode({ difficulty }: { difficulty: Difficulty }) {
  const pool = useMemo(() => PRACTICE_ITEMS.filter((i) => i.difficulty === difficulty), [difficulty]);

  const makeRound = useCallback(
    (used: Set<string>, current?: PracticeItem) => {
      const n = nextItem(pool, used, current);
      return { ...n, options: buildOptions(n.item, pool) };
    },
    [pool]
  );

  const [round, setRound] = useState(() => makeRound(new Set()));
  const [selected, setSelected] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [right, setRight] = useState(0);
  const [answered, setAnswered] = useState(0);

  const { item, options } = round;
  const accuracy = answered ? Math.round((right / answered) * 100) : 0;
  const answeredRight = selected !== null && isCorrect(item, selected);

  const choose = (opt: string) => {
    if (selected !== null) return;
    const ok = isCorrect(item, opt);
    setSelected(opt);
    setAnswered((n) => n + 1);
    setRight((n) => n + (ok ? 1 : 0));
    setStreak((n) => (ok ? n + 1 : 0));
  };

  const next = () => {
    setRound((r) => makeRound(r.used, r.item));
    setSelected(null);
  };

  const optionClass = (opt: string) =>
    "pr-option" + (selected === null ? "" : isCorrect(item, opt) ? " is-correct" : opt === selected ? " is-wrong" : "");

  return (
    <div className="pr-card pr-card--quiz" data-state={selected === null ? undefined : answeredRight ? "correct" : "wrong"}>
      <div className="pr-score" aria-live="polite">
        <div className="pr-stats">
          <span className="pr-stat">
            <strong>{streak}</strong>
            <span className="secondary">current streak</span>
          </span>
          <span className="pr-stat">
            <strong>{accuracy}%</strong>
            <span className="secondary">accuracy</span>
          </span>
        </div>
        <div className="pr-meter" role="progressbar" aria-label="Accuracy" aria-valuemin={0} aria-valuemax={100} aria-valuenow={accuracy}>
          <span style={{ width: `${accuracy}%` }} />
        </div>
      </div>

      <Prompt item={item} />

      <div className="pr-options" role="group" aria-label="Answer choices">
        {options.map((opt) => (
          <button key={opt} className={optionClass(opt)} onClick={() => choose(opt)} disabled={selected !== null}>
            {opt}
          </button>
        ))}
      </div>

      <div className="pr-quiz-foot">
        <div
          className="pr-feedback"
          role="status"
          aria-live="polite"
          data-kind={selected === null ? "" : answeredRight ? "correct" : "wrong"}
        >
          {selected !== null && (answeredRight ? "Correct." : `Not quite. The answer is “${item.latin}”.`)}
        </div>
        <button className="pr-btn primary" onClick={next} disabled={selected === null}>
          Next question
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page: Pagsasanay                                                    */
/* ------------------------------------------------------------------ */

const MODE_LABEL: Record<Mode, string> = { flashcard: "Flashcards", quiz: "Quiz" };

function Practice() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [mode, setMode] = useState<Mode>("flashcard");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  // false: choosing a mode and difficulty. true: a session is running.
  const [started, setStarted] = useState(false);
  const bodyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("bb-theme", theme);
    } catch {
      /* storage unavailable: theme still applies for this visit */
    }
  }, [theme]);

  const nextTheme: Theme = theme === "light" ? "dark" : "light";
  const diff = DIFFICULTIES.find((d) => d.id === difficulty)!;

  const setSession = (on: boolean) => {
    setStarted(on); // leaving a session unmounts it, which resets queue, score and input
    bodyRef.current?.scrollTo({ top: 0 });
  };

  return (
    <div className="home practice">
      <main className="pr-body" ref={bodyRef}>
        <nav className="nav">
          <div className="nav-inner">
            <Link to="/" className="brand">
              <span className="bb-key" aria-hidden="true">ᜊᜌ᜔ᜊᜌᜒᜈ᜔</span>
              <span className="brand-name">Baybayin</span>
            </Link>

            <ul className="nav-links">
              <li><Link to="/">About</Link></li>
              <li><Link to="/keyboard">Keyboard</Link></li>
              <li><Link to="/lessons">Lessons</Link></li>
              <li><Link to="/practice" aria-current="page">Practice</Link></li>
            </ul>

            <button className="icon-btn" onClick={() => setTheme(nextTheme)} aria-label={`Switch to ${nextTheme} mode`}>
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </nav>

        <div className={`pr-wrap${started ? " is-session" : ""}`}>
          {started ? (
            <div className="pr-stage" key="session">
              <div className="pr-status">
                <div className="pr-pills" role="group" aria-label="Current practice settings">
                  <span className="pr-pill" title="Mode">{MODE_LABEL[mode]}</span>
                  <span className="pr-pill" title={`Difficulty: ${diff.sub}`}>{diff.label}</span>
                </div>
                <button className="pr-change" onClick={() => setSession(false)}>
                  Change mode
                </button>
              </div>

              {mode === "flashcard" ? (
                <FlashcardMode key={`f-${difficulty}`} difficulty={difficulty} />
              ) : (
                <QuizMode key={`q-${difficulty}`} difficulty={difficulty} />
              )}
            </div>
          ) : (
            <div className="pr-stage" key="setup">
              <header className="pr-head">
                <h1>Practice</h1>
                <p className="secondary">Read the Baybayin, then type how it sounds in Latin letters.</p>
              </header>

              <div className="pr-controls">
                <div className="pr-seg" role="group" aria-label="Practice mode">
                  <button aria-pressed={mode === "flashcard"} onClick={() => setMode("flashcard")}>
                    Flashcards
                    <small>Endless, no score</small>
                  </button>
                  <button aria-pressed={mode === "quiz"} onClick={() => setMode("quiz")}>
                    Quiz
                    <small>Pick the answer</small>
                  </button>
                </div>

                <div className="pr-seg" role="group" aria-label="Difficulty">
                  {DIFFICULTIES.map((d) => (
                    <button key={d.id} aria-pressed={difficulty === d.id} onClick={() => setDifficulty(d.id)}>
                      {d.label}
                      <small>{d.sub}</small>
                    </button>
                  ))}
                </div>

                <button className="pr-btn primary pr-start" onClick={() => setSession(true)}>
                  Start practice
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="footer">
          <div className="section-inner">
            <span className="bb-inline" aria-hidden="true">ᜊᜌ᜔ᜊᜌᜒᜈ᜔</span>
            <span>Learn · Practice · Write</span>
          </div>
        </footer>
    </div>
  );
}

export default Practice;