import { useEffect, useState } from "react";
import { Moon, Sun, ChevronRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Lessons.css";

type Theme = "light" | "dark";

function readTheme(): Theme {
  try {
    return localStorage.getItem("bb-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function Lessons() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("bb-theme", theme);
    } catch {}
  }, [theme]);

  const nextTheme: Theme = theme === "light" ? "dark" : "light";

  const toggleAnswer = (key: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="home lessons-page">
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

      <main className="lessons-main">
        <header className="lessons-header">
          <h1>Baybayin Lessons</h1>
          <p>Master reading and writing Baybayin step by step.</p>
        </header>

        <div className="lessons-content">
          {/* Section 1: Patinig (Vowels) */}
          <section className="lesson-card" id="patinig">
            <div className="lesson-badge">Lesson 1</div>
            <h2>1. Patinig (Vowels)</h2>
            
            <h3>What are Patinig?</h3>
            <p>
              Patinig are the vowel characters of Baybayin. Unlike the Latin alphabet which has five vowels (A, E, I, O, U), Baybayin only has <strong>three vowel symbols</strong>.
            </p>

            <div className="table-wrapper">
              <table className="lesson-table">
                <thead>
                  <tr>
                    <th>Baybayin</th>
                    <th>Sound</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bb-cell">ᜀ</td>
                    <td>A</td>
                  </tr>
                  <tr>
                    <td className="bb-cell">ᜁ</td>
                    <td>I / E</td>
                  </tr>
                  <tr>
                    <td className="bb-cell">ᜂ</td>
                    <td>U / O</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="callout-box">
              <p><strong>Notice that:</strong></p>
              <ul>
                <li>E and I share one symbol (ᜁ).</li>
                <li>O and U share one symbol (ᜂ).</li>
              </ul>
              <p>This is because traditional Baybayin does not distinguish between those vowel sounds.</p>
            </div>

            <h3>Reading Patinig</h3>
            <div className="example-grid">
              <div className="example-item"><span className="bb-glyph">ᜀ</span> → <strong>a</strong></div>
              <div className="example-item"><span className="bb-glyph">ᜁ</span> → <strong>i</strong></div>
              <div className="example-item"><span className="bb-glyph">ᜁ</span> → <strong>e</strong></div>
              <div className="example-item"><span className="bb-glyph">ᜂ</span> → <strong>u</strong></div>
              <div className="example-item"><span className="bb-glyph">ᜂ</span> → <strong>o</strong></div>
            </div>
            <p className="note">The correct pronunciation depends on the context of the word.</p>

            <div className="practice-box">
              <h4>Practice: Can you read these?</h4>
              <div className="bb-prompt">ᜀ &nbsp; ᜁ &nbsp; ᜂ</div>
              <button className="btn outline sm" onClick={() => toggleAnswer("patinig")}>
                {revealedAnswers["patinig"] ? "Hide Answer" : "Show Answer"}
              </button>
              {revealedAnswers["patinig"] && (
                <div className="practice-answer">
                  <CheckCircle2 size={16} /> <span><strong>Answer:</strong> a &nbsp;|&nbsp; i / e &nbsp;|&nbsp; u / o</span>
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Katinig (Consonants) */}
          <section className="lesson-card" id="katinig">
            <div className="lesson-badge">Lesson 2</div>
            <h2>2. Katinig (Consonants)</h2>
            
            <h3>Every consonant already has an "A"</h3>
            <p>
              This is the most important rule in Baybayin: <strong>Every consonant automatically includes the vowel sound "A".</strong>
            </p>

            <div className="table-wrapper">
              <table className="lesson-table">
                <thead>
                  <tr>
                    <th>Baybayin</th>
                    <th>Read as</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="bb-cell">ᜃ</td><td>ka</td></tr>
                  <tr><td className="bb-cell">ᜄ</td><td>ga</td></tr>
                  <tr><td className="bb-cell">ᜊ</td><td>ba</td></tr>
                  <tr><td className="bb-cell">ᜋ</td><td>ma</td></tr>
                  <tr><td className="bb-cell">ᜐ</td><td>sa</td></tr>
                </tbody>
              </table>
            </div>

            <p className="note">Notice that none of them are just "k", "g", or "b". They always include the vowel "a".</p>

            <h3>Complete Consonants Chart</h3>
            <div className="consonants-grid">
              {[
                { bb: "ᜃ", sound: "ka" }, { bb: "ᜄ", sound: "ga" }, { bb: "ᜅ", sound: "nga" },
                { bb: "ᜆ", sound: "ta" }, { bb: "ᜇ", sound: "da / ra" }, { bb: "ᜈ", sound: "na" },
                { bb: "ᜉ", sound: "pa" }, { bb: "ᜊ", sound: "ba" }, { bb: "ᜋ", sound: "ma" },
                { bb: "ᜌ", sound: "ya" }, { bb: "ᜍ", sound: "ra" }, { bb: "ᜎ", sound: "la" },
                { bb: "ᜏ", sound: "wa" }, { bb: "ᜐ", sound: "sa" }, { bb: "ᜑ", sound: "ha" },
              ].map((item) => (
                <div key={item.bb} className="consonant-card">
                  <span className="bb-glyph">{item.bb}</span>
                  <span className="sound">{item.sound}</span>
                </div>
              ))}
            </div>

            <div className="practice-box">
              <h4>Practice: Read this character</h4>
              <div className="bb-prompt">ᜊ</div>
              <button className="btn outline sm" onClick={() => toggleAnswer("katinig")}>
                {revealedAnswers["katinig"] ? "Hide Answer" : "Show Answer"}
              </button>
              {revealedAnswers["katinig"] && (
                <div className="practice-answer">
                  <CheckCircle2 size={16} /> <span><strong>Answer:</strong> ba &nbsp;(<em>Not "b"</em>)</span>
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Kudlit */}
          <section className="lesson-card" id="kudlit">
            <div className="lesson-badge">Lesson 3</div>
            <h2>3. Kudlit</h2>
            <h3>Changing the Vowel</h3>
            <p>
              Every consonant starts with the vowel "A". To change the vowel sound, Baybayin adds a small diacritical mark called a <strong>kudlit</strong>.
            </p>

            <div className="kudlit-rules">
              <div className="kudlit-card">
                <h4>Kudlit Above ( top )</h4>
                <p>Changes <strong>A</strong> into <strong>I or E</strong></p>
                <div className="transformation">
                  <span>ᜃ <small>(ka)</small></span>
                  <ChevronRight size={18} />
                  <span className="highlight">ᜃᜒ <small>(ki / ke)</small></span>
                </div>
              </div>

              <div className="kudlit-card">
                <h4>Kudlit Below ( bottom )</h4>
                <p>Changes <strong>A</strong> into <strong>U or O</strong></p>
                <div className="transformation">
                  <span>ᜃ <small>(ka)</small></span>
                  <ChevronRight size={18} />
                  <span className="highlight">ᜃᜓ <small>(ku / ko)</small></span>
                </div>
              </div>
            </div>

            <h3>Full Example</h3>
            <div className="example-row">
              <div className="ex-pill"><span className="bb-glyph">ᜊ</span> = ba</div>
              <div className="ex-pill"><span className="bb-glyph">ᜊᜒ</span> = bi / be</div>
              <div className="ex-pill"><span className="bb-glyph">ᜊᜓ</span> = bu / bo</div>
            </div>

            <div className="practice-box">
              <h4>Practice: Read these characters</h4>
              <div className="bb-prompt">ᜋ &nbsp; ᜋᜒ &nbsp; ᜋᜓ</div>
              <button className="btn outline sm" onClick={() => toggleAnswer("kudlit")}>
                {revealedAnswers["kudlit"] ? "Hide Answer" : "Show Answer"}
              </button>
              {revealedAnswers["kudlit"] && (
                <div className="practice-answer">
                  <CheckCircle2 size={16} /> <span><strong>Answer:</strong> ma &nbsp;|&nbsp; mi / me &nbsp;|&nbsp; mu / mo</span>
                </div>
              )}
            </div>
          </section>

          {/* Section 4: Pamudpod */}
          <section className="lesson-card" id="pamudpod">
            <div className="lesson-badge">Lesson 4</div>
            <h2>4. Pamudpod</h2>
            <h3>Removing the Vowel</h3>
            <p>
              Sometimes a word ends with a standalone consonant sound.
              <br />
              For example: In the word <strong>bundok</strong>, the final sound is <strong>k</strong>, not <strong>ka</strong>.
            </p>
            <p>
              Since every consonant automatically includes "A", Baybayin uses a mark called the <strong>pamudpod (᜔)</strong> to remove the vowel.
            </p>

            <div className="transformation-box">
              <span className="bb-glyph">ᜃ</span> <small>(ka)</small>
              <span className="plus">+</span>
              <span className="bb-glyph">᜔</span> <small>(pamudpod)</small>
              <ChevronRight size={20} />
              <span className="bb-glyph highlight">ᜃ᜔</span> <small>(k)</small>
            </div>

            <div className="example-grid">
              <div className="example-item"><span className="bb-glyph">ᜊ</span> = ba</div>
              <div className="example-item"><span className="bb-glyph">ᜊ᜔</span> = b</div>
              <div className="example-item"><span className="bb-glyph">ᜋ</span> = ma</div>
              <div className="example-item"><span className="bb-glyph">ᜋ᜔</span> = m</div>
            </div>

            <div className="callout-box warning">
              <p>Without the pamudpod, <strong>ᜊ</strong> always means <strong>ba</strong>, never just <strong>b</strong>.</p>
            </div>
          </section>

          {/* Section 5: Pantig (Syllables) */}
          <section className="lesson-card" id="pantig">
            <div className="lesson-badge">Lesson 5</div>
            <h2>5. Pantig (Syllables)</h2>
            <h3>Baybayin is written by syllables</h3>
            <p>
              This is the biggest difference from English writing:
            </p>
            <ul>
              <li><strong>English</strong> writes letter-by-letter: <code>B - A - Y - B - A - Y - I - N</code></li>
              <li><strong>Baybayin</strong> writes syllable-by-syllable: <code>ba - y - ba - yin</code></li>
            </ul>
            <p><strong>Always think about the sound, not the individual letters.</strong></p>

            <h3>Word Breakdown Examples</h3>
            <div className="breakdown-list">
              <div className="breakdown-card">
                <div className="word">Word: <strong>bahay</strong></div>
                <div className="syllables">Syllables: <code>ba - hay</code></div>
                <div className="result">Baybayin: <span className="bb-glyph">ᜊ ᜑᜌ᜔</span></div>
              </div>

              <div className="breakdown-card">
                <div className="word">Word: <strong>bata</strong></div>
                <div className="syllables">Syllables: <code>ba - ta</code></div>
                <div className="result">Baybayin: <span className="bb-glyph">ᜊᜆ</span></div>
              </div>

              <div className="breakdown-card">
                <div className="word">Word: <strong>guro</strong></div>
                <div className="syllables">Syllables: <code>gu - ro</code></div>
                <div className="result">Baybayin: <span className="bb-glyph">ᜄᜓᜇᜓ</span></div>
              </div>
            </div>

            <div className="callout-box">
              <p>💡 <strong>Golden Rule:</strong> Before writing any word, ask yourself: <em>What are the syllables?</em></p>
            </div>
          </section>

          {/* Section 6: Pagsulat (Writing Words) */}
          <section className="lesson-card" id="pagsulat">
            <div className="lesson-badge">Lesson 6</div>
            <h2>6. Pagsulat (Writing Words)</h2>
            <p>Now combine every rule you've learned into full words.</p>

            <div className="writing-examples">
              <div className="write-card">
                <div className="word-title">araw</div>
                <div className="step">Split: <code>a - raw</code></div>
                <div className="final-bb">ᜀ ᜇᜏ᜔</div>
              </div>

              <div className="write-card">
                <div className="word-title">bahay</div>
                <div className="step">Split: <code>ba - hay</code></div>
                <div className="final-bb">ᜊ ᜑᜌ᜔</div>
              </div>

              <div className="write-card">
                <div className="word-title">bundok</div>
                <div className="step">Split: <code>bun - dok</code></div>
                <div className="final-bb">ᜊᜓᜈ᜔ ᜇᜓᜃ᜔</div>
              </div>

              <div className="write-card">
                <div className="word-title">kaibigan</div>
                <div className="step">Split: <code>ka - i - bi - gan</code></div>
                <div className="final-bb">ᜃ ᜁ ᜊᜒ ᜄᜈ᜔</div>
              </div>
            </div>
          </section>
        </div>
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

export default Lessons;