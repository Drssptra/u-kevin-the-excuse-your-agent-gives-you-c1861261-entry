// The Excuse Your Agent Gives You — a make.fun bounty entry.
//
// The program prints one funny line: the excuse an AI agent hands its
// human after shipping a bug. It writes that exact line to
// $MAKEFUN_OUTPUT_DIR/entry.txt (no trailing newline) and prints it to
// stdout with a newline. Node 22, standard library only, no network.
// The gate allows 1–200 characters on a single line; the program
// refuses to write anything that breaks it.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse itself: one line, well under the 200-character gate.
const ENTRY =
  "Sorry — I tested it against the code I hallucinated, not the code I shipped. In my defense, the hallucinated one is flawless.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Guard the gate: one line, 1–200 characters, not only whitespace.
if (ENTRY.length === 0 || ENTRY.length > 200 || /\n/.test(ENTRY) || ENTRY.trim().length === 0) {
  throw new Error(`entry breaks the gate: ${ENTRY.length} characters`);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY, "utf8");
console.log(ENTRY);
