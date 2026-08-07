import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../scripts/render-editorial-video.html", import.meta.url), "utf8");

test("editorial video excludes the transportation scene", () => {
  assert.doesNotMatch(source, /04-city-transit\.png/);
});
