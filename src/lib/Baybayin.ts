export type WritingStyle = "modern" | "traditional";

export const PAMUDPOD = "᜔";

const VOWELS: Record<string, string> = {
  a: "ᜀ",
  i: "ᜁ",
  e: "ᜁ",
  o: "ᜂ",
  u: "ᜂ",
};

// Kudlit: above for i/e, below for u/o. "a" needs no mark.
const KUDLIT: Record<string, string> = { i: "ᜒ", e: "ᜒ", o: "ᜓ", u: "ᜓ" };

const CONSONANTS: Record<string, string> = {
  k: "ᜃ",
  g: "ᜄ",
  ng: "ᜅ",
  t: "ᜆ",
  d: "ᜇ",
  n: "ᜈ",
  p: "ᜉ",
  b: "ᜊ",
  m: "ᜋ",
  y: "ᜌ",
  r: "ᜍ",
  l: "ᜎ",
  w: "ᜏ",
  s: "ᜐ",
  h: "ᜑ",
};

// Letters Filipino borrowed from other languages, mapped to the closest sound.
const FOREIGN: Record<string, string> = {
  c: "k",
  f: "p",
  v: "b",
  z: "s",
  q: "k",
  j: "dy",
  x: "ks",
  ñ: "ny",
};

const isVowel = (c: string) => "aeiou".includes(c);

function spell(word: string): string {
  return word
    .toLowerCase()
    .replace(/c(?=[ei])/g, "s")
    .replace(/[cfvzqjxñ]/g, (c) => FOREIGN[c]);
}

function transliterateWord(raw: string, style: WritingStyle): string {
  if (raw.toLowerCase() === "mga") return "ᜋᜅ"; // conventional spelling
  const w = spell(raw);
  let out = "";
  let i = 0;

  while (i < w.length) {
    const c = w[i];

    if (isVowel(c)) {
      out += VOWELS[c];
      i += 1;
      continue;
    }

    const key = c === "n" && w[i + 1] === "g" ? "ng" : c;
    const base = CONSONANTS[key];
    if (!base) {
      out += c;
      i += 1;
      continue;
    }
    i += key.length;

    const next = w[i];
    if (next && isVowel(next)) {
      out += base + (KUDLIT[next] ?? "");
      i += 1;
    } else if (style === "modern") {
      out += base + PAMUDPOD; // final consonant: cancel the built-in "a"
    }
    // Traditional style simply leaves final consonants unwritten.
  }
  return out;
}

/** Converts a whole Latin text to Baybayin (for translator pages and tests). */
export function transliterate(text: string, style: WritingStyle = "modern"): string {
  return text
    .split(/([a-zA-ZñÑ]+)/)
    .map((part) =>
      /^[a-zA-ZñÑ]+$/.test(part)
        ? transliterateWord(part, style)
        : part.replace(/,/g, "᜵").replace(/[.!?]/g, "᜶"),
    )
    .join("");
}

/* ------------------------------------------------------------------ */
/* Incremental editing: used by the Baybayin input box.               */
/*                                                                    */
/* Every function takes the text BEFORE the caret and returns the new */
/* text before the caret. Marks (kudlit, pamudpod) are always applied */
/* to the consonant right before them, so they can never stack or     */
/* float on their own.                                                */
/* ------------------------------------------------------------------ */

const BASES = new Set(Object.values(CONSONANTS));
const KUDLITS = new Set(["ᜒ", "ᜓ"]);

const last = (s: string, n = 1) => s.slice(-n);
const endsWithBase = (s: string) => s.length > 0 && BASES.has(last(s));
const endsWithBaseMark = (s: string) =>
  s.length > 1 &&
  BASES.has(s[s.length - 2]) &&
  (KUDLITS.has(last(s)) || last(s) === PAMUDPOD);

/** A letter typed on a physical keyboard. */
export function applyLatin(before: string, raw: string): string {
  const c = raw.toLowerCase();

  if (FOREIGN[c]) return [...FOREIGN[c]].reduce(applyLatin, before);
  if (raw === ",") return before + "᜵";
  if (raw === "." || raw === "!" || raw === "?") return before + "᜶";
  if (!/^[a-z]$/.test(c)) return before + raw; // space, digits, Baybayin, etc.

  if (isVowel(c)) {
    // Right after a lone consonant ("k" shown as ᜃ᜔), the vowel completes it.
    if (last(before) === PAMUDPOD && endsWithBaseMark(before)) {
      const stem = before.slice(0, -1);
      return c === "a" ? stem : stem + KUDLIT[c];
    }
    return before + VOWELS[c];
  }

  // "n" then "g" becomes the single character NGA.
  if (c === "g" && before.endsWith("ᜈ" + PAMUDPOD)) {
    return before.slice(0, -2) + "ᜅ" + PAMUDPOD;
  }
  // A lone consonant is shown with the pamudpod until a vowel follows.
  return before + CONSONANTS[c] + PAMUDPOD;
}

/** A key tapped on the on-screen Baybayin keyboard. */
export function applyBaybayinKey(before: string, key: string): string {
  if (KUDLITS.has(key)) {
    if (endsWithBase(before)) return before + key;
    if (endsWithBaseMark(before)) return before.slice(0, -1) + key; // swap mark
    return before; // nothing to attach to
  }
  if (key === PAMUDPOD) {
    if (endsWithBase(before)) return before + key;
    if (endsWithBaseMark(before)) return before.slice(0, -1) + key;
    return before;
  }
  return before + key; // vowels, consonants, space, punctuation
}

/** Backspace: a consonant with its pamudpod is removed as one unit. */
export function applyBackspace(before: string): string {
  if (last(before) === PAMUDPOD && endsWithBaseMark(before)) {
    return before.slice(0, -2);
  }
  return before.slice(0, -1);
}