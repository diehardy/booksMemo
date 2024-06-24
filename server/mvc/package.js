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
    knex("public.books").select().orderBy('id', 'asc')

exports.addBook = async (book_name, book_description, is_audiobook, audiobook_source) =>
    knex("public.books").insert({
        name: book_name, description: book_description, is_audiobook: is_audiobook,
        audiobook_source: audiobook_source
    })

exports.editBook = async (id, book_name, book_description, is_audiobook, audiobook_source) =>
    knex("public.books").update({
        name: book_name, description: book_description, is_audiobook: is_audiobook,
        audiobook_source: audiobook_source
    }).where('id', id)

exports.deleteBook = async (id_book) =>
    knex("public.books").where('id', id_book).delete()


exports.getBookById = async (id_book) =>
    knex("public.books").where('id', id_book).select()
