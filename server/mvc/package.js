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


exports.getBooks = async (chosen_page, qnt_per_page, limit) =>
    knex("public.books").select().orderBy('id', 'asc').offset((chosen_page - 1) * qnt_per_page).limit(limit)

exports.countPages = async () =>
    knex("public.books").select().count('id')

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

exports.deleteSubsection = async (id_subsection) =>
    knex("public.subsections").where('id_subsection', id_subsection).delete()

exports.deleteSection = async (id_section) => {
    try {
        await knex.transaction(async (trx) => {

            // Delete all subsections associated with the section
            await trx('public.subsections')
                .where('public.subsections.parent_section', id_section)
                .del();

            // delete the section 
            await trx('public.sections')
                .where('public.sections.id_section', id_section)
                .del();

            // Commit the transaction
            await trx.commit();
            console.log('Committed successfully');
        });
    } catch (error) {
        console.error('Transaction rolled back due to error:', error);
        throw error;
    }
};



exports.deleteChapter = async (id_chapter) => {
    try {
        await knex.transaction(async (trx) => {

            const sections = await trx('public.sections')
                .where('public.sections.parent_chapter', id_chapter)
                .select('public.sections.id_section')

            const sectionIds = sections.map(section => section.id_section)



            // Delete all subsections associated with the section
            await trx('public.subsections')
                .whereIn('public.subsections.parent_section', sectionIds)
                .del();

            // Delete all chapters associated with the chapter
            await trx('public.sections')
                .where('public.sections.parent_chapter', id_chapter)
                .del();

            // Delete the chapter
            await trx('public.chapters')
                .where('public.chapters.id_chapter', id_chapter)
                .del();

            // Commit the transaction
            await trx.commit();
            console.log('Committed successfully');
        });
    } catch (error) {
        console.error('Transaction rolled back due to error:', error);
        throw error;
    }
};







exports.deleteBook = async (id_book) => {
    try {
        await knex.transaction(async (trx) => {
            // Delete all subsections associated with the book
            await trx('public.subsections')
                .where('public.subsections.id_book', id_book)
                .del();

            // Delete all sections associated with the book
            await trx('public.sections')
                .where('public.sections.id_book', id_book)
                .del();

            // Delete all chapters associated with the book
            await trx('public.chapters')
                .where('public.chapters.id_book', id_book)
                .del();

            // Delete the book
            await trx('public.books')
                .where('public.books.id', id_book)
                .del();

            // Commit the transaction
            await trx.commit();
            console.log('Committed successfully');
        });
    } catch (error) {
        console.error('Transaction rolled back due to error:', error);
        throw error;
    }
};



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


exports.addChapter = async (id_book, chapter_name) =>
    knex("public.chapters").insert({
        id_book: id_book, chapter_name: chapter_name
    })

exports.editChapter = async (id_chapter, chapter_name) =>
    knex("public.chapters").update({
        chapter_name: chapter_name
    }).where('id_chapter', id_chapter)






exports.addSection = async (id_book, section_name, parent_chapter) =>
    knex("public.sections").insert({
        id_book: id_book, section_name: section_name, parent_chapter: parent_chapter
    })

exports.editSection = async (id_section, section_name) =>
    knex("public.sections").update({
        section_name: section_name
    }).where('id_section', id_section)


exports.addSubsection = async (id_book, subsection_name, parent_section) =>
    knex("public.subsections").insert({
        id_book: id_book, subsection_name: subsection_name, parent_section: parent_section
    })

exports.editSubsection = async (id_subsection, subsection_name) =>
    knex("public.subsections").update({
        subsection_name: subsection_name
    }).where('id_subsection', id_subsection)