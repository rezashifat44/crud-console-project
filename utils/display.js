function author(blog) {
    return blog.User ? `${blog.User.firstname} ${blog.User.lastname}` : "";
}

function formatDate(date) {
    return new Date(date).toLocaleString();
}

export function printBlogs(blogs, emptyMessage = "No blogs are found") {
    if (blogs.length === 0) {
        console.log(emptyMessage);
        return;
    }
    for (const blog of blogs) {
        console.log("------------------------------------------------");
        console.log(`#${blog.id}  ${blog.blogTitle}  [${blog.category}]`);
        if (blog.User) console.log(`By ${author(blog)}`);
        console.log(`Created: ${formatDate(blog.createAt)}  Updated: ${formatDate(blog.updateAt)}`);
        console.log("");
        console.log(blog.blog);
    }
    console.log("------------------------------------------------");
}

export function printBlogTitles(blogs) {
    if (blogs.length === 0) {
        console.log("No blogs are found");
        return;
    }
    console.log("Your blogs:");
    for (const blog of blogs) console.log(`  #${blog.id}  ${blog.blogTitle}`);
}

export function printUsers(users) {
    if (users.length === 0) {
        console.log("No users are found");
        return;
    }
    console.table(users.map((u) => ({
        id: u.id,
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        createAt: formatDate(u.createAt),
    })));
}
