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

// BOOKS


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


// CONTENTS 

exports.getChapters = async (id_book) =>
    knex("public.chapters")
        .select('public.chapters.id_book', 'public.chapters.chapter_name', 'public.chapters.id_chapter', 'public.sections.id_section', 'public.sections.section_name', 'public.sections.parent_chapter', 'public.subsections.id_subsection', 'public.subsections.parent_section', 'public.subsections.subsection_name')
        .leftJoin('public.sections', 'public.chapters.id_chapter', '=', 'public.sections.parent_chapter')
        .leftJoin('public.subsections', 'public.sections.id_section', '=', 'public.subsections.parent_section')
        .where('public.chapters.id_book', id_book)
        .orderBy('id_chapter')
        .orderBy('id_section')
        .orderBy('id_subsection')


