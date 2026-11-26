import readline from "node:readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
// Reading through the async iterator buffers lines, so piped input is not lost
// between prompts (rl.question drops lines that arrive before it is called).
const lines = rl[Symbol.asyncIterator]();

export class InputClosed extends Error {}

export async function ask(question) {
    process.stdout.write(question);
    const { value, done } = await lines.next();
    if (done) throw new InputClosed("Input closed.");
    if (!process.stdin.isTTY) process.stdout.write(`${value}\n`);
    return value.trim();
}

export async function askRequired(question) {
    while (true) {
        const value = await ask(question);
        if (value) return value;
        console.log("This field is required.");
    }
}

export async function askId(question) {
    while (true) {
        const value = await ask(question);
        if (/^\d+$/.test(value) && Number(value) > 0) return Number(value);
        console.log("Please enter a valid numeric ID.");
    }
}

export async function confirm(question) {
    const answer = await ask(`${question} (y/n): `);
    return answer.toLowerCase() === "y";
}

export function closePrompt() {
    rl.close();
}
