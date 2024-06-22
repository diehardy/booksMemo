const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
});
console.log(process.env.DB_HOST)

exports.getBooks = async () =>
    knex("public.books").select()

exports.addBook = async (book_name, book_description) =>
    knex("public.books").insert({ name: book_name, description: book_description })
