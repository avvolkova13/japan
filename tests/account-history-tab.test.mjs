import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../src/app/account/page.tsx", import.meta.url), "utf8");

test("account dashboard exposes overview and purchase history as tabs", () => {
  assert.match(page, /type AccountDashboardView = "overview" \| "history";/);
  assert.match(page, /const \[dashboardView, setDashboardView\] = useState<AccountDashboardView>\("overview"\);/);
  assert.match(page, /aria-pressed=\{dashboardView === "history"\}/);
  assert.match(page, /onClick=\{\(\) => setDashboardView\("history"\)\}/);
  assert.match(page, /dashboardView === "overview"/);
});
