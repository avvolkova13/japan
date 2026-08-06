import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../src/app/account/page.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("login title stays on one line on desktop", () => {
  assert.match(
    page,
    /<h1 id="account-title" className=\{mode === "login" \? "account-auth-title--login" : undefined\}>\{title\}<\/h1>/,
  );
  assert.match(
    styles,
    /\.account-auth-panel h1\.account-auth-title--login\s*\{[^}]*max-width:\s*none;[^}]*white-space:\s*nowrap;/s,
  );
});

test("login title may wrap on narrow screens", () => {
  assert.match(
    styles,
    /@media \(max-width: 767px\)[\s\S]*?\.account-auth-panel h1\.account-auth-title--login\s*\{[^}]*white-space:\s*normal;/,
  );
});
