import { Sequelize, DataTypes } from "sequelize";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: false,
});

const timestampOptions = {
    timestamps: true,
    createdAt: "createAt",
    updatedAt: "updateAt",
};

export const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: "user" },
}, { tableName: "users", ...timestampOptions });

export const Blog = sequelize.define("Blog", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    blogTitle: { type: DataTypes.STRING, allowNull: false },
    blog: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
}, { tableName: "blogs", ...timestampOptions });

User.hasMany(Blog, { foreignKey: "userId", onDelete: "CASCADE" });
Blog.belongsTo(User, { foreignKey: "userId" });

async function createDatabaseIfMissing() {
    const connection = await mysql.createConnection({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.end();
}

export async function initDb() {
    await createDatabaseIfMissing();
    await sequelize.authenticate();
    await sequelize.sync();
}

export async function closeDb() {
    await sequelize.close();
}
