import { ask, askRequired, InputClosed } from "../utils/prompt.js";
import { printBlogs } from "../utils/display.js";
import { register, login } from "../controllers/authController.js";
import { allBlog } from "../controllers/blogController.js";
import { userMenu } from "./userMenu.js";
import { adminMenu } from "./adminMenu.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function registerFlow() {
    const firstname = await askRequired("First name: ");
    const lastname = await askRequired("Last name: ");
    let email = await askRequired("Email: ");
    while (!EMAIL_PATTERN.test(email)) {
        console.log("Please enter a valid email address.");
        email = await askRequired("Email: ");
    }
    const password = await askRequired("Password: ");
    await register({ firstname, lastname, email: email.toLowerCase(), password });
    console.log("Registration successful. You can now log in.");
}

async function loginFlow() {
    const email = await askRequired("Email: ");
    const password = await askRequired("Password: ");
    const user = await login(email.toLowerCase(), password);
    console.log(`Welcome, ${user.firstname} ${user.lastname}!`);
    if (user.role === "admin") {
        await adminMenu(user);
    } else {
        await userMenu(user);
    }
}

export async function mainMenu() {
    while (true) {
        console.log("\n===== Blog App =====");
        console.log("1. View All Blogs");
        console.log("2. Login");
        console.log("3. Register");
        console.log("0. Exit");
        const choice = await ask("Choose an option: ");

        try {
            switch (choice) {
                case "1":
                    printBlogs(await allBlog());
                    break;
                case "2":
                    await loginFlow();
                    break;
                case "3":
                    await registerFlow();
                    break;
                case "0":
                    console.log("Goodbye!");
                    return;
                default:
                    console.log("Invalid option. Please try again.");
            }
        } catch (error) {
            if (error instanceof InputClosed) throw error;
            console.log(error.message);
        }
    }
}
