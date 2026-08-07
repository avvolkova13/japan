import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../src/components/editorial-video-scroll.tsx", import.meta.url), "utf8");

test("keeps the preposition with the second line of the editorial phrase", () => {
  assert.match(source, /От первого прикосновения —<br \/>к привычке, которая остается\./);
});
