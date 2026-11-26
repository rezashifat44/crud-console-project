import bcrypt from "bcryptjs";
import { User } from "../db.js";

export async function register({ firstname, lastname, email, password }) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
        throw new Error("User with this email already exists.");
    }
    const hashed = await bcrypt.hash(password, 10);
    return User.create({ firstname, lastname, email, password: hashed });
}

export async function login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid email or password.");
    }
    if (!user.isActive) {
        throw new Error("User is deactivated");
    }
    return user;
}
