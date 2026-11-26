import { ask, askRequired, askId, confirm, InputClosed } from "../utils/prompt.js";
import { printBlogs, printUsers } from "../utils/display.js";
import { searchBlog, deleteBlog } from "../controllers/blogController.js";
import { allUsers, allUsersBlog, updateUserStatus, deleteUser } from "../controllers/adminController.js";

async function updateUserFlow(admin) {
    const id = await askId("User ID to update: ");
    if (id === admin.id) throw new Error("You cannot change your own status.");
    let answer = await ask("Set isActive (true/false): ");
    while (answer !== "true" && answer !== "false") {
        console.log('Please type "true" or "false".');
        answer = await ask("Set isActive (true/false): ");
    }
    const user = await updateUserStatus(id, answer === "true");
    console.log(`User ${user.email} is now ${user.isActive ? "active" : "deactivated"}.`);
}

async function deleteUserFlow(admin) {
    const id = await askId("User ID to delete: ");
    if (id === admin.id) throw new Error("You cannot delete your own account.");
    if (!(await confirm(`Delete user ${id} and all of their blogs?`))) {
        console.log("Cancelled.");
        return;
    }
    await deleteUser(id);
    console.log(`User with ID ${id} deleted successfully.`);
}

async function deleteBlogFlow() {
    const id = await askId("Blog ID to delete: ");
    const [current] = await searchBlog(String(id));
    if (!current) throw new Error(`Blog with ID ${id} not found.`);
    if (!(await confirm(`Delete "${current.blogTitle}"?`))) {
        console.log("Cancelled.");
        return;
    }
    await deleteBlog(id);
    console.log(`Blog with ID ${id} deleted successfully.`);
}

export async function adminMenu(admin) {
    while (true) {
        console.log("\n===== Admin Menu =====");
        console.log("1. View All Users");
        console.log("2. View All Blogs");
        console.log("3. Search Blog by ID/Title");
        console.log("4. Update User");
        console.log("5. Delete User");
        console.log("6. Delete Blog");
        console.log("0. Logout");
        const choice = await ask("Choose an option: ");

        try {
            switch (choice) {
                case "1":
                    printUsers(await allUsers());
                    break;
                case "2":
                    printBlogs(await allUsersBlog());
                    break;
                case "3": {
                    const term = await askRequired("Enter blog ID or title: ");
                    printBlogs(await searchBlog(term), "No matching blog found.");
                    break;
                }
                case "4":
                    await updateUserFlow(admin);
                    break;
                case "5":
                    await deleteUserFlow(admin);
                    break;
                case "6":
                    await deleteBlogFlow();
                    break;
                case "0":
                    console.log("Logged out.");
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
