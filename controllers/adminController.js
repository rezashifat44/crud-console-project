import { User } from "../db.js";
import { allBlog } from "./blogController.js";

export async function allUsers() {
    return User.findAll({ attributes: { exclude: ["password"] }, order: [["id", "ASC"]] });
}

export async function allUsersBlog() {
    return allBlog();
}

async function findUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error(`User with ID ${id} not found.`);
    return user;
}

export async function updateUserStatus(id, isActive) {
    const user = await findUser(id);
    return user.update({ isActive });
}

export async function deleteUser(id) {
    const user = await findUser(id);
    await user.destroy();
}
