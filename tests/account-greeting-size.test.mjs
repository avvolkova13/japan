import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("account greeting uses a restrained display size", () => {
  assert.match(
    styles,
    /\.account-dashboard-main h1\s*\{[^}]*max-width:\s*14ch;[^}]*font-size:\s*clamp\(2\.8rem, 4\.2vw, 4\.6rem\);/s,
  );
});
