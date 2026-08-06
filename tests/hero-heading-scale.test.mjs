import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("hero ritual heading uses the larger display scale", () => {
  assert.match(styles, /\.hero-motion h1 \{[\s\S]*font-size:\s*clamp\(7rem, 18vw, 18rem\)/);
  assert.match(styles, /\.hero-motion h1 \{[\s\S]*width:\s*min\(100%, 11ch\)/);
  assert.doesNotMatch(styles, /\.hero-motion h1 \{ font-size: clamp\(4\.2rem, 12vw, 8rem\); \}/);
  assert.match(styles, /\.hero-motion h1 \{[\s\S]*font-size:\s*clamp\(4\.5rem, 22vw, 6rem\)/);
  assert.doesNotMatch(styles, /font-size: clamp\(3\.35rem, 16\.5vw, 5rem\)/);
  assert.match(styles, /\.hero-motion h1 \{[\s\S]*font-size:\s*clamp\(5rem, 6\.2vw, 8rem\)/);
  assert.doesNotMatch(styles, /font-size: clamp\(4\.2rem, 4\.8vw, 8rem\)/);
});
