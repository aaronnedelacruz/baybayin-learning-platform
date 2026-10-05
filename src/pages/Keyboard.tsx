import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import {
  applyBackspace,
  applyBaybayinKey,
  applyLatin,
} from "../lib/Baybayin";
import "../styles/Home.css";
import "../styles/Keyboard.css";

type Theme = "light" | "dark";

interface Key {
  char: string; // what gets inserted
  label: string; // small caption under the character
  mark?: boolean; // combining marks are shown on a dotted circle
}

interface KeyGroup {
  id: string;
  title: string;
  keys: Key[];
}

const PATINIG: KeyGroup = {
  id: "patinig",
  title: "Patinig",
  keys: [
    { char: "ᜀ", label: "a" },
    { char: "ᜁ", label: "e / i" },
    { char: "ᜂ", label: "o / u" },
  ],
};

const KUDLIT: KeyGroup = {
  id: "kudlit",
  title: "Kudlit and pamudpod",
  keys: [
    { char: "ᜒ", label: "e / i", mark: true },
    { char: "ᜓ", label: "o / u", mark: true },
    { char: "᜔", label: "‎ ", mark: true },
  ],
};

const KATINIG: KeyGroup = {
  id: "katinig",
  title: "Katinig",
  keys: [
    { char: "ᜃ", label: "ka" },
    { char: "ᜄ", label: "ga" },
    { char: "ᜅ", label: "nga" },
    { char: "ᜆ", label: "ta" },
    { char: "ᜇ", label: "da / ra" },
    { char: "ᜈ", label: "na" },
    { char: "ᜉ", label: "pa" },
    { char: "ᜊ", label: "ba" },
    { char: "ᜋ", label: "ma" },
    { char: "ᜌ", label: "ya" },
    { char: "ᜍ", label: "ra" },
    { char: "ᜎ", label: "la" },
    { char: "ᜏ", label: "wa" },
    { char: "ᜐ", label: "sa" },
    { char: "ᜑ", label: "ha" },
  ],
};

function readTheme(): Theme {
  try {
    return localStorage.getItem("bb-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function KeyCard({ k, onPress }: { k: Key; onPress: (char: string) => void }) {
  return (
    <button
      type="button"
      className="kb-key"
      aria-label={k.label}
      onMouseDown={(e) => e.preventDefault()} // keep focus (and caret) in the input
      onClick={() => onPress(k.char)}
    >
      <span className="bb-key">{k.mark ? "\u25CC" + k.char : k.char}</span>
      <small>{k.label}</small>
    </button>
  );
}

function Keyboard() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [value, setValue] = useState("");
  const [notice, setNotice] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("bb-theme", theme);
    } catch {}
  }, [theme]);

  const nextTheme: Theme = theme === "light" ? "dark" : "light";

  function say(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 1800);
  }

  /**
   * Runs an edit on the text before the caret, keeps the text after it, and
   * puts the caret back. If text is selected, the selection is replaced.
   */
  const apply = useCallback(
    (edit: (before: string) => string, backspace = false) => {
      const el = inputRef.current;
      if (!el) return;
      const { selectionStart: start, selectionEnd: end, value: current } = el;
      const hasSelection = start !== end;
      const fn = backspace && hasSelection ? (b: string) => b : edit;
      const before = fn(current.slice(0, start));
      const caret = before.length;
      setValue(before + current.slice(end));
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(caret, caret);
      });
    },
    [],
  );

  // The Baybayin box is the only input. Letters typed on a physical keyboard
  // are turned into Baybayin as they arrive, so Latin text never appears.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const onBeforeInput = (e: InputEvent) => {
      if (e.isComposing) return;
      if (e.inputType === "insertText" && e.data) {
        e.preventDefault();
        apply((b) => [...e.data!].reduce(applyLatin, b));
      } else if (e.inputType === "deleteContentBackward") {
        e.preventDefault();
        apply(applyBackspace, true);
      }
    };

    el.addEventListener("beforeinput", onBeforeInput);
    return () => el.removeEventListener("beforeinput", onBeforeInput);
  }, [apply]);

  function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    apply((b) => [...text].reduce(applyLatin, b));
  }

  const press = (char: string) => apply((b) => applyBaybayinKey(b, char));

  async function copy() {
    if (!value) return say("Type something first");
    try {
      await navigator.clipboard.writeText(value);
      say("Copied");
    } catch {
      say("Could not copy. Select the text and copy it.");
    }
  }

  async function download() {
    const text = value.replace(/\s+/g, " ").trim();
    if (!text) return say("Type something first");
    try {
      await document.fonts.load('96px "Noto Sans Tagalog"', text);
    } catch {}
    const W = 1200;
    const H = 630;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFF3B0";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#335C67";
    ctx.fillRect(0, H - 24, W, 24);
    ctx.fillStyle = "#1A0D07";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const font = (s: number) => `${s}px "Noto Sans Tagalog", sans-serif`;
    let size = 120;
    let lines: string[] = [];
    for (; size >= 48; size -= 8) {
      ctx.font = font(size);
      lines = [];
      let line = "";
      for (const word of text.split(" ")) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > W - 160 && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      lines.push(line);
      if (lines.length * size * 1.4 < H - 120) break;
    }
    ctx.font = font(size);
    const lineHeight = size * 1.4;
    const top = (H - 24) / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((l, i) => ctx.fillText(l, W / 2, top + i * lineHeight));

    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "baybayin.png";
      a.click();
      URL.revokeObjectURL(a.href);
      say("Image saved");
    });
  }

  function clear() {
    setValue("");
    inputRef.current?.focus();
  }

  return (
    <div className="home kb-page">
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

      <main className="kb-main">
        <header className="kb-head">
          <h1>Baybayin keyboard</h1>
          <p>
            Type with your keyboard or tap the characters below. Letters turn into Baybayin as you type.
          </p>
        </header>

        <section className="kb-translator" aria-label="Baybayin writing area">
          <label htmlFor="kb-input">Baybayin</label>
          <textarea
            id="kb-input"
            className="kb-field bb-output"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)} // fallback; typing is handled above
            onPaste={onPaste}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder=""
          />

          <div className="kb-actions">
            <button className="btn" onClick={copy}>
              Copy
            </button>
            <button className="btn outline" onClick={download}>
              Download
            </button>
            <button className="btn danger" onClick={clear}>
              Clear
            </button>
            <span className="kb-notice caption" role="status">
              {notice}
            </span>
          </div>
        </section>

        <section className="kb-keyboard" aria-label="On-screen Baybayin keyboard">
          <div className="kb-band">
            {[PATINIG, KUDLIT].map((g) => (
              <div key={g.id} className="kb-group">
                <h5>{g.title}</h5>
                <div className="kb-keys">
                  {g.keys.map((k) => (
                    <KeyCard key={k.char} k={k} onPress={press} />
                  ))}
                </div>
              </div>
            ))}

            <div className="kb-group">
              <h5>Editing</h5>
              <div className="kb-keys">
                <button
                  type="button"
                  className="kb-key space"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => apply((b) => b + " ")}
                >
                  <small>Space</small>
                </button>
                <button
                  type="button"
                  className="kb-key"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => apply(applyBackspace, true)}
                >
                  <span className="kb-glyph">⌫</span>
                  <small>Delete</small>
                </button>
              </div>
            </div>
          </div>

          <div className="kb-group kb-row">
            <h5>{KATINIG.title}</h5>
            <div className="kb-keys consonants">
              {KATINIG.keys.map((k) => (
                <KeyCard key={k.char} k={k} onPress={press} />
              ))}
            </div>
          </div>
        </section>
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

export default Keyboard;