import { initDb, closeDb } from "./db.js";
import { mainMenu } from "./menus/mainMenu.js";
import { closePrompt, InputClosed } from "./utils/prompt.js";

try {
    await initDb();
    await mainMenu();
} catch (error) {
    if (!(error instanceof InputClosed)) {
        console.error("Application error:", error.message);
        process.exitCode = 1;
    }
} finally {
    closePrompt();
    await closeDb().catch(() => {});
}
