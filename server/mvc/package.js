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
    knex("public.books").select().orderBy('id', 'asc').offset((chosen_page - 1) * qnt_per_page).limit(Number(limit))
exports.checkChapter = async (id_book) =>
    knex("public.chapters").select().where('id_book', id_book)

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

exports.deleteSubsection = async (id_subsection) => {
    try {
        await knex.transaction(async (trx) => {

            // Delete all subsections associated with the section
            await trx('public.notes')
                .where('public.notes.parent_structure', id_subsection)
                .andWhere('public.notes.parent_type', 'subsection')
                .del();

            // delete the section 
            await trx("public.subsections")
                .where('id_subsection', id_subsection).del()
            // Commit the transaction
            await trx.commit();
            console.log('Committed successfully');
        });
    } catch (error) {
        console.error('Transaction rolled back due to error:', error);
        throw error;
    }
}



exports.deleteSection = async (id_section) => {
    try {
        await knex.transaction(async (trx) => {

            const subsections = await trx('public.subsections')
                .where('public.subsections.parent_section', id_section)
                .select('public.subsections.id_subsection')

            const subsectionsIds = subsections.map(subsection => subsection.id_subsection)

            // Delete all subsections associated with the section
            await trx('public.notes')
                .whereIn('public.notes.parent_structure', subsectionsIds)
                .andWhere('public.notes.parent_type', 'subsection')
                .del();

            await trx('public.notes')
                .where('public.notes.parent_structure', id_section)
                .andWhere('public.notes.parent_type', 'section')
                .del();

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

            const subsections = await trx('public.subsections')
                .whereIn('public.subsections.parent_section', sectionIds)
                .select('public.subsections.id_subsection')

            const subsectionsIds = subsections.map(subsection => subsection.id_subsection)

            // Delete all subsections associated with the section
            await trx('public.notes')
                .whereIn('public.notes.parent_structure', subsectionsIds)
                .andWhere('public.notes.parent_type', 'subsection')
                .del();

            await trx('public.notes')
                .whereIn('public.notes.parent_structure', sectionIds)
                .andWhere('public.notes.parent_type', 'section')
                .del();
            await trx('public.notes')
                .where('public.notes.parent_structure', id_chapter)
                .andWhere('public.notes.parent_type', 'chapter')
                .del();

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
            await trx('public.notes')
                .where('public.notes.id_book', id_book)
                .del();
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

exports.getContents = async (id_book) =>
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


// NOTES 
exports.countNotes = async (contentsType) =>
    knex("public.notes").select().where('note_type', contentsType).count('id_note')


exports.getChapters = async (id_book) =>
    knex("public.chapters")
        .select()
        .where('public.chapters.id_book', id_book)
        .orderBy('id_chapter')

exports.getSections = async (id_chapter) =>
    knex("public.sections")
        .select()
        .where('public.sections.parent_chapter', id_chapter)
        .orderBy('id_section')

exports.getSubsections = async (id_section) =>
    knex("public.subsections")
        .select()
        .where('public.subsections.parent_section', id_section)
        .orderBy('id_subsection')



exports.addNote = async (note_word, note_name, note_description, page, timecode, id_book, parent_structure, parent_type, note_type) =>
    knex("public.notes").insert({
        note_word: note_word,
        note_name: note_name, note_description: note_description, page: page,
        timecode: timecode, id_book: id_book, parent_structure: parent_structure, parent_type: parent_type, note_type
    })


exports.editNote = async (id_note, note_word, note_name, note_description, page, timecode, id_book, parent_structure, parent_type) =>
    knex("public.notes").update({
        note_word: note_word,
        note_name: note_name, note_description: note_description, page: page,
        timecode: timecode, id_book: id_book, parent_structure: parent_structure, parent_type: parent_type
    }).where('id_note', id_note)


exports.getNotes = async (id_structure, type_structure, contentsType, chosen_page, qnt_per_page, limit) =>
    knex("public.notes")
        .select()
        .where('public.notes.parent_structure', id_structure)
        .andWhere('public.notes.parent_type', type_structure)
        .andWhere('public.notes.note_type', contentsType)
        .orderBy('page')
        .orderBy('id_note')
        .offset((chosen_page - 1) * qnt_per_page).limit(Number(limit))

exports.deleteNote = async (id_note) =>
    knex("public.notes").where('id_note', id_note).delete()