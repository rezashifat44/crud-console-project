import { Op } from "sequelize";
import { Blog, User } from "../db.js";

const withAuthor = {
    include: { model: User, attributes: ["firstname", "lastname"] },
    order: [["id", "ASC"]],
};

// Reader journey: every blog, no login needed.
export async function allBlog() {
    return Blog.findAll(withAuthor);
}

export async function userBlogs(userId) {
    return Blog.findAll({ where: { userId }, order: [["id", "ASC"]] });
}

// A whole number is matched as a blog ID; anything else as part of the title.
// Pass userId to limit the search to that user's blogs.
export async function searchBlog(term, userId) {
    const value = term.trim();
    const where = /^\d+$/.test(value)
        ? { id: Number(value) }
        : { blogTitle: { [Op.like]: `%${value}%` } };
    if (userId !== undefined) where.userId = userId;
    return Blog.findAll({ where, ...withAuthor });
}

export async function createBlog(userId, { blogTitle, blog, category }) {
    return Blog.create({ userId, blogTitle, blog, category });
}

async function findOwnedBlog(id, userId) {
    const blog = await Blog.findByPk(id);
    if (!blog || (userId !== undefined && blog.userId !== userId)) {
        throw new Error(`Blog with ID ${id} not found.`);
    }
    return blog;
}

export async function updateBlog(id, data, userId) {
    const blog = await findOwnedBlog(id, userId);
    return blog.update(data);
}

// Pass userId to allow deleting only that user's blog; omit it for admin.
export async function deleteBlog(id, userId) {
    const blog = await findOwnedBlog(id, userId);
    await blog.destroy();
}
