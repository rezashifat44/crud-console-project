# Console Blog App (CRUD Console Project)

A console-based blog application built with **Node.js**, **JavaScript** and **MySQL**. Readers can browse all blogs without an account. Registered users can create, search, update and delete their own blogs. Admins can manage every user and every blog.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database](#database)
- [Setup](#setup)
- [Usage](#usage)
- [Creating an Admin](#creating-an-admin)
- [Video Demonstration](#video-demonstration)

## Tech Stack

| Tool | Purpose |
|---|---|
| Node.js (v18+) | Runtime (ES modules, top-level `await`) |
| JavaScript | Language |
| MySQL | Database |
| Sequelize + mysql2 | ORM and MySQL driver |
| bcryptjs | Password hashing |
| dotenv | Loads database settings from `.env` |
| readline (built-in) | Console input |

## Features

### Reader (no login)
- View every blog with its author, category and dates (`allBlog()`).

### Registration and Login
- Anyone can register with first name, last name, email and password.
- Emails must be unique. Passwords are stored as bcrypt hashes, never as plain text.
- A deactivated user cannot log in and sees **"User is deactivated"**.
- After login, the user is sent to the **User Menu** or the **Admin Menu** depending on their role.

### User
- On login, the titles of the user's blogs are shown, or **"No blogs are found"** if they have none.
- View their own blogs in full.
- Search their own blogs by ID or title.
- Create any number of blogs.
- Update a blog by ID. Press Enter to keep any field unchanged.
- Delete a blog by ID, after a confirmation prompt.
- A user can only see, change or delete their **own** blogs in this menu.

### Admin
- View the complete user list (`allUsers()`). Passwords are never shown.
- View all blogs from all users (`allUsersBlog()`).
- Search any blog by ID or title.
- Activate or deactivate a user (`isActive` = `true` / `false`).
- Delete any user. Their blogs are deleted with them.
- Delete any blog.
- An admin cannot deactivate or delete their own account.

## Project Structure

```
CRUD-Console-Project/
├── main.js                  # Entry point: connect DB → main menu → close
├── db.js                    # Creates the database, defines models and their relationship
├── controllers/
│   ├── authController.js    # register, login
│   ├── blogController.js    # allBlog, userBlogs, searchBlog, createBlog, updateBlog, deleteBlog
│   └── adminController.js   # allUsers, allUsersBlog, updateUserStatus, deleteUser
├── menus/
│   ├── mainMenu.js          # View All Blogs / Login / Register
│   ├── userMenu.js          # User console menu
│   └── adminMenu.js         # Admin console menu
├── utils/
│   ├── prompt.js            # Console input helpers
│   └── display.js           # Prints blogs and users
├── .env.example             # Template for .env
├── .env                     # Your database settings (not committed)
└── package.json
```

## Database

Database name: **`blogdb`**. The app creates the database and both tables automatically on first run.

### `users`

| Column | Type | Notes |
|---|---|---|
| `id` | INT | Primary key, auto increment |
| `firstname` | VARCHAR | Required |
| `lastname` | VARCHAR | Required |
| `email` | VARCHAR | Required, unique |
| `password` | VARCHAR | Required, bcrypt hash |
| `isActive` | BOOLEAN | Default `true` |
| `role` | VARCHAR | Default `user`; set to `admin` by hand |
| `createAt` | DATETIME | Set automatically |
| `updateAt` | DATETIME | Set automatically |

### `blogs`

| Column | Type | Notes |
|---|---|---|
| `id` | INT | Primary key, auto increment |
| `userId` | INT | Foreign key → `users.id` |
| `blogTitle` | VARCHAR | Required |
| `blog` | TEXT | Required, blog content |
| `category` | VARCHAR | Required |
| `createAt` | DATETIME | Set automatically |
| `updateAt` | DATETIME | Set automatically |

### Relationship

**One-to-many:** one user can write many blogs, and each blog belongs to one user. `blogs.userId` references `users.id` with `ON DELETE CASCADE`, so deleting a user also deletes their blogs.

```
users (1) ────────< (many) blogs
  id  ◄──────────────  userId
```

## Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or newer
- [MySQL](https://dev.mysql.com/downloads/) server running locally (or anywhere you can reach)

### 1. Get the project and install dependencies

```bash
cd CRUD-Console-Project
npm install
```

### 2. Create a `.env` file

The project includes a template, `.env.example`. Copy it to `.env`:

```bash
# macOS / Linux / Git Bash
cp .env.example .env
```

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

Then open `.env` and fill in your own MySQL settings:

| Variable | Description | Example |
|---|---|---|
| `DB_NAME` | Database name (keep `blogdb`) | `blogdb` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_mysql_password` |
| `DB_HOST` | MySQL server host | `localhost` |
| `DB_PORT` | MySQL server port | `3306` |

`.env` holds your real password, so never commit it. Only `.env.example` belongs in version control. The MySQL user needs permission to create a database. If it doesn't have that permission, create `blogdb` yourself first:

```sql
CREATE DATABASE blogdb;
```

### 3. Run the app

```bash
npm start
```

On first run, the `blogdb` database and the `users` and `blogs` tables are created automatically.

## Usage

Type the number of an option and press **Enter**.

### Main Menu

```
===== Blog App =====
1. View All Blogs
2. Login
3. Register
0. Exit
```

- **1** shows every blog. No login needed.
- **2** asks for an email and password, then opens the User or Admin menu.
- **3** asks for first name, last name, email and password.

### User Menu

```
===== User Menu =====
1. View Your Blogs
2. Search Blog by ID/Title
3. Create Blog
4. Update Blog
5. Delete Blog
0. Logout
```

| Option | What you enter |
|---|---|
| 1. View Your Blogs | nothing |
| 2. Search Blog | a blog ID (e.g. `3`) or part of a title (e.g. `travel`) |
| 3. Create Blog | title, category, content |
| 4. Update Blog | blog ID, then new values (Enter keeps the current value) |
| 5. Delete Blog | blog ID, then `y` to confirm |

### Admin Menu

```
===== Admin Menu =====
1. View All Users
2. View All Blogs
3. Search Blog by ID/Title
4. Update User
5. Delete User
6. Delete Blog
0. Logout
```

| Option | What you enter |
|---|---|
| 1. View All Users | nothing |
| 2. View All Blogs | nothing |
| 3. Search Blog | a blog ID or part of a title |
| 4. Update User | user ID, then `true` (activate) or `false` (deactivate) |
| 5. Delete User | user ID, then `y` to confirm; their blogs are deleted too |
| 6. Delete Blog | blog ID, then `y` to confirm |

## Creating an Admin

The app has no option to become an admin. An admin is made by hand:

1. Run `npm start` and register a normal account (e.g. `admin@blog.com`).
2. Change its role in MySQL (Workbench or the command line):

   ```sql
   UPDATE blogdb.users SET role = 'admin' WHERE email = 'admin@blog.com';
   ```

3. Log in with that account. The Admin Menu opens.

### Example admin walkthrough
1. Register a normal user, log in, create a blog, then log out.
2. Log in as admin and use **1** to find the user's ID.
3. Use **4** with that ID and `false`, then log out.
4. Try logging in as that user. The console shows **"User is deactivated"**.
5. Log in as admin again. Use **4** with `true` to reactivate the user, **6** to delete a blog, or **5** to delete the user along with all their blogs.

## Video Demonstration

> 🎥 A video walkthrough of the application will be added here.

<!-- Replace the line below with your video link, e.g. [Watch the demo](https://youtu.be/your-video-id) -->
**Video link:** _Coming soon_
