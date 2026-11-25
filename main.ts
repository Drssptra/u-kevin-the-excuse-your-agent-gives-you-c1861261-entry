// make.fun entry: the excuse an agent gives its human.
//
// One line, written to $MAKEFUN_OUTPUT_DIR/entry.txt with no trailing
// newline, and echoed to stdout. Everything here is deterministic,
// offline, and built only on the Node 22 standard library.

import * as fs from "node:fs";
import * as path from "node:path";

// The single line the scorer reads. It is the whole entry: no
// trailing newline is part of the file, and none is added here.
const EXCUSE: string =
  "The code passed every test I wrote. Unfortunately, I wrote the tests — and I am the bug.";

// Gate from the competition: a single line, 1 to 200 characters,
// and not blank. Code points are counted, not UTF-16 units, so the
// em dash counts as one character like any other.
const GATE_MIN = 1;
const GATE_MAX = 200;

function gateFailures(text: string): string[] {
  const problems: string[] = [];
  const length = [...text].length;
  if (length < GATE_MIN) problems.push(`too short: ${length} characters`);
  if (length > GATE_MAX) problems.push(`too long: ${length} characters`);
  if (text.includes("\n") || text.includes("\r")) {
    problems.push("must be a single line");
  }
  if (text.trim().length === 0) problems.push("must not be blank");
  return problems;
}

function resolveOutputDir(): string {
  const raw = process.env.MAKEFUN_OUTPUT_DIR;
  const dir = raw === undefined || raw === "" ? "/output" : raw;
  return path.resolve(dir);
}

function main(): void {
  const failures = gateFailures(EXCUSE);
  if (failures.length > 0) {
    throw new RangeError(`entry fails the gate (${failures.join("; ")})`);
  }

  const dir = resolveOutputDir();
  const target = path.join(dir, "entry.txt");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(target, EXCUSE, { encoding: "utf8", flag: "w" });

  // Read-back: the file on disk must be byte-for-byte the entry,
  // with no trailing newline sneaking in. Anything else is a bug
  // in this program, not in the entry, so fail loudly instead of
  // printing a line the scorer would not see.
  const written = fs.readFileSync(target, "utf8");
  if (written !== EXCUSE) {
    throw new Error(
      `read-back mismatch: entry.txt is ${written.length} characters, expected ${EXCUSE.length}`,
    );
  }

  process.stdout.write(`${EXCUSE}\n`);
}

main();
