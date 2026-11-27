const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function load() {
  const exports = {};
  const source = fs.readFileSync(
    path.join(__dirname, "../src/product/pulseMotion.ts"),
    "utf8",
  );
  vm.runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    { exports, Math },
  );
  return exports;
}
const m = load();
const fresh = { hr: 118, hrAgeMs: 300, hrStatus: "fresh" };

test("reading time is known only for a fresh pulse with an age", () => {
  assert.equal(m.pulseReadingAtMs(fresh, 10_000), 9_700);
  assert.equal(
    m.pulseReadingAtMs({ ...fresh, hrStatus: "stale" }, 10_000),
    null,
  );
  assert.equal(m.pulseReadingAtMs({ ...fresh, hr: null }, 10_000), null);
  assert.equal(m.pulseReadingAtMs({ ...fresh, hrAgeMs: null }, 10_000), null);
});

test("the same reading reported again is not a new beat", () => {
  assert.equal(m.isNewPulseReading(null, 9_700), true);
  assert.equal(m.isNewPulseReading(9_700, 9_705), false);
  assert.equal(m.isNewPulseReading(9_700, 10_700), true);
  assert.equal(m.isNewPulseReading(9_700, null), false);
});

test("session contours follow the pulse like the design", () => {
  assert.equal(m.sessionContourEnergy(60), 0.45);
  assert.equal(m.sessionContourEnergy(110), 0.5);
  assert.equal(m.sessionContourEnergy(150), 1);
  assert.equal(m.sessionContourEnergy(190), 1);
});

test("ready contours stay calm within the design range", () => {
  assert.equal(m.readyContourEnergy(60), 0.55);
  assert.ok(Math.abs(m.readyContourEnergy(76) - 0.65) < 1e-9);
  assert.equal(m.readyContourEnergy(120), 0.8);
});

test("contours settle with an ease-out over 720 ms", () => {
  const from = { phase: 0, energy: 0.8 };
  const to = { phase: 0.45, energy: 0.6 };
  assert.deepEqual(
    { ...m.contourSettleFrame(from, to, 0) },
    { ...from, done: false },
  );
  const middle = m.contourSettleFrame(from, to, 360);
  assert.ok(Math.abs(middle.phase - 0.45 * 0.875) < 1e-9);
  assert.equal(middle.done, false);
  assert.deepEqual(
    { ...m.contourSettleFrame(from, to, 720) },
    { ...to, done: true },
  );
  assert.deepEqual(
    { ...m.contourSettleFrame(from, to, 2_000) },
    {
      ...to,
      done: true,
    },
  );
});
