import { ask, askRequired, askId, confirm, InputClosed } from "../utils/prompt.js";
import { printBlogs, printBlogTitles } from "../utils/display.js";
import { userBlogs, searchBlog, createBlog, updateBlog, deleteBlog } from "../controllers/blogController.js";

async function createFlow(user) {
    const blogTitle = await askRequired("Blog title: ");
    const category = await askRequired("Category: ");
    const blog = await askRequired("Blog content: ");
    const created = await createBlog(user.id, { blogTitle, blog, category });
    console.log(`Blog created with ID ${created.id}.`);
}

async function updateFlow(user) {
    const id = await askId("Blog ID to update: ");
    // Ownership is checked before asking for new values.
    const [current] = await searchBlog(String(id), user.id);
    if (!current) throw new Error(`Blog with ID ${id} not found.`);

    console.log("Press Enter to keep the current value.");
    const blogTitle = await ask(`Blog title [${current.blogTitle}]: `);
    const category = await ask(`Category [${current.category}]: `);
    const blog = await ask("Blog content [keep current]: ");

    const changes = {};
    if (blogTitle) changes.blogTitle = blogTitle;
    if (category) changes.category = category;
    if (blog) changes.blog = blog;
    if (Object.keys(changes).length === 0) {
        console.log("Nothing to update.");
        return;
    }
    await updateBlog(id, changes, user.id);
    console.log(`Blog with ID ${id} updated successfully.`);
}

async function deleteFlow(user) {
    const id = await askId("Blog ID to delete: ");
    const [current] = await searchBlog(String(id), user.id);
    if (!current) throw new Error(`Blog with ID ${id} not found.`);
    if (!(await confirm(`Delete "${current.blogTitle}"?`))) {
        console.log("Cancelled.");
        return;
    }
    await deleteBlog(id, user.id);
    console.log(`Blog with ID ${id} deleted successfully.`);
}

export async function userMenu(user) {
    printBlogTitles(await userBlogs(user.id));

    while (true) {
        console.log("\n===== User Menu =====");
        console.log("1. View Your Blogs");
        console.log("2. Search Blog by ID/Title");
        console.log("3. Create Blog");
        console.log("4. Update Blog");
        console.log("5. Delete Blog");
        console.log("0. Logout");
        const choice = await ask("Choose an option: ");

        try {
            switch (choice) {
                case "1":
                    printBlogs(await userBlogs(user.id));
                    break;
                case "2": {
                    const term = await askRequired("Enter blog ID or title: ");
                    printBlogs(await searchBlog(term, user.id), "No matching blog found.");
                    break;
                }
                case "3":
                    await createFlow(user);
                    break;
                case "4":
                    await updateFlow(user);
                    break;
                case "5":
                    await deleteFlow(user);
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
