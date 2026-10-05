import { useState } from "react";
import type { CSSProperties } from "react";
import { Check, ChevronLeft, ChevronRight, RefreshCw, X } from "lucide-react";

export interface QuizOption {
  label: string;
  glyph?: boolean; // true: the label is Baybayin and is drawn large
}

export interface QuizQuestion {
  prompt: string;
  glyph?: string; // optional large Baybayin character shown under the prompt
  options: QuizOption[];
  answer: number; // index of the correct option
  explain: string;
}

const TEXT_OPTION: CSSProperties = {
  fontFamily: "var(--sans)",
  fontSize: 20,
  fontWeight: 700,
  color: "var(--text-h)",
};

/**
 * Multiple-choice quiz that never blocks the lesson: answers can be changed,
 * questions can be revisited, and the lesson's own Next button stays active.
 * Uses the shared lesson styles from Lesson1.css.
 */
function MultiQuiz({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );

  const q = questions[index];
  const pick = picks[index];
  const answered = picks.filter((p) => p !== null).length;
  const score = picks.filter((p, i) => p === questions[i].answer).length;
  const done = answered === questions.length;

  function choose(i: number) {
    setPicks((prev) => prev.map((p, n) => (n === index ? i : p)));
  }

  function restart() {
    setPicks(questions.map(() => null));
    setIndex(0);
  }

  const status =
    pick === null ? "" : pick === q.answer ? "is-correct" : "is-wrong";

  return (
    <>
      <p>
        <small>
          Question {index + 1} of {questions.length} - Score {score} of{" "}
          {questions.length}
        </small>
      </p>
      <p>{q.prompt}</p>
      {q.glyph && (
        <div
          className="bb-card"
          style={{ textAlign: "center", marginBottom: 8 }}
          aria-hidden="true"
        >
          {q.glyph}
        </div>
      )}

      <div className="lp-options" role="group" aria-label="Answer choices">
        {q.options.map((o, i) => {
          const state =
            pick === i ? (i === q.answer ? "is-correct" : "is-wrong") : "";
          return (
            <button
              key={`${index}-${o.label}`}
              className={`lp-option${o.glyph ? " bb-card" : ""} ${state}`}
              style={o.glyph ? undefined : TEXT_OPTION}
              onClick={() => choose(i)}
              aria-pressed={pick === i}
              aria-label={o.glyph ? `Option ${i + 1}` : undefined}
            >
              {o.label}
              {pick === i &&
                (i === q.answer ? (
                  <Check className="lp-option-icon" size={20} aria-hidden="true" />
                ) : (
                  <X className="lp-option-icon" size={20} aria-hidden="true" />
                ))}
            </button>
          );
        })}
      </div>

      <div className={`lp-feedback ${status}`} role="status">
        {pick === null
          ? "Pick an answer. You can change it, and you can move on at any time."
          : `${pick === q.answer ? "Correct." : "Not quite."} ${q.explain}${
              pick === q.answer ? "" : " Try another."
            }`}
      </div>

      <div className="lp-row" style={{ marginTop: 16 }}>
        <button
          className="lp-btn outline"
          onClick={() => setIndex((n) => Math.max(0, n - 1))}
          disabled={index === 0}
        >
          <ChevronLeft size={18} aria-hidden="true" /> Previous question
        </button>
        <button
          className="lp-btn outline"
          onClick={() => setIndex((n) => Math.min(questions.length - 1, n + 1))}
          disabled={index === questions.length - 1}
        >
          Next question <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      {done && (
        <div className="lp-feedback" role="status" style={{ marginTop: 16 }}>
          You got {score} of {questions.length}. Retry for a better score, or
          move on whenever you are ready.{" "}
          <button
            className="lp-btn outline"
            style={{ marginLeft: 8, padding: "6px 12px" }}
            onClick={restart}
          >
            <RefreshCw size={16} aria-hidden="true" /> Retry
          </button>
        </div>
      )}
    </>
  );
}

export default MultiQuiz;