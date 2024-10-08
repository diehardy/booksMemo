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
exports.checkBook = async (id_book, id_user) =>
    knex("public.books").select().where('id', id_book).andWhere('id_user', id_user)

exports.getBooks = async (chosen_page, qnt_per_page, limit, id_user) =>
    knex("public.books").select().where('id_user', id_user).orderBy('id', 'asc').offset((chosen_page - 1) * qnt_per_page).limit(Number(limit))
exports.checkChapter = async (id_book, id_user) =>
    knex("public.chapters").select().where('id_book', id_book).andWhere('id_user', id_user)

exports.countPages = async (id_user) =>
    knex("public.books").select().where('id_user', id_user).count('id')

exports.addBook = async (book_name, book_description, is_audiobook, audiobook_source, id_user) =>
    knex("public.books").insert({
        name: book_name, description: book_description, is_audiobook: is_audiobook,
        audiobook_source: audiobook_source, id_user: id_user
    })

exports.editBook = async (id, book_name, book_description, is_audiobook, audiobook_source, id_user) =>
    knex("public.books").update({
        name: book_name, description: book_description, is_audiobook: is_audiobook,
        audiobook_source: audiobook_source
    }).where('id', id).andWhere('id_user', id_user)

exports.deleteSubsection = async (id_subsection, id_user) => {
    try {
        await knex.transaction(async (trx) => {

            // Delete all subsections associated with the section
            await trx('public.notes')
                .where('public.notes.parent_structure', id_subsection)
                .andWhere('public.notes.parent_type', 'subsection')
                .andWhere('id_user', id_user)
                .del();

            // delete the section 
            await trx("public.subsections")
                .where('id_subsection', id_subsection).andWhere('id_user', id_user).del()
            // Commit the transaction
            await trx.commit();
            console.log('Committed successfully');
        });
    } catch (error) {
        console.error('Transaction rolled back due to error:', error);
        throw error;
    }
}



exports.deleteSection = async (id_section, id_user) => {
    try {
        await knex.transaction(async (trx) => {

            const subsections = await trx('public.subsections')
                .where('public.subsections.parent_section', id_section)
                .andWhere('id_user', id_user)
                .select('public.subsections.id_subsection')

            const subsectionsIds = subsections.map(subsection => subsection.id_subsection)

            // Delete all subsections associated with the section
            await trx('public.notes')
                .whereIn('public.notes.parent_structure', subsectionsIds)
                .andWhere('public.notes.parent_type', 'subsection')
                .andWhere('id_user', id_user)
                .del();

            await trx('public.notes')
                .where('public.notes.parent_structure', id_section)
                .andWhere('id_user', id_user)
                .andWhere('public.notes.parent_type', 'section')
                .del();

            await trx('public.subsections')
                .where('public.subsections.parent_section', id_section)
                .andWhere('id_user', id_user)
                .del();

            // delete the section 
            await trx('public.sections')
                .where('public.sections.id_section', id_section)
                .andWhere('id_user', id_user)
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



exports.deleteChapter = async (id_chapter, id_user) => {
    try {
        await knex.transaction(async (trx) => {


            const sections = await trx('public.sections')
                .where('public.sections.parent_chapter', id_chapter)
                .andWhere('id_user', id_user)
                .select('public.sections.id_section')

            const sectionIds = sections.map(section => section.id_section)

            const subsections = await trx('public.subsections')
                .whereIn('public.subsections.parent_section', sectionIds)
                .andWhere('id_user', id_user)
                .select('public.subsections.id_subsection')

            const subsectionsIds = subsections.map(subsection => subsection.id_subsection)

            // Delete all subsections associated with the section
            await trx('public.notes')
                .whereIn('public.notes.parent_structure', subsectionsIds)
                .andWhere('id_user', id_user)
                .andWhere('public.notes.parent_type', 'subsection')
                .del();

            await trx('public.notes')
                .whereIn('public.notes.parent_structure', sectionIds)
                .andWhere('public.notes.parent_type', 'section')
                .andWhere('id_user', id_user)
                .del();
            await trx('public.notes')
                .where('public.notes.parent_structure', id_chapter)
                .andWhere('public.notes.parent_type', 'chapter')
                .andWhere('id_user', id_user)
                .del();

            // Delete all subsections associated with the section
            await trx('public.subsections')
                .whereIn('public.subsections.parent_section', sectionIds)
                .andWhere('id_user', id_user)
                .del();

            // Delete all chapters associated with the chapter
            await trx('public.sections')
                .where('public.sections.parent_chapter', id_chapter)
                .andWhere('id_user', id_user)
                .del();

            // Delete the chapter
            await trx('public.chapters')
                .where('public.chapters.id_chapter', id_chapter)
                .andWhere('id_user', id_user)
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







exports.deleteBook = async (id_book, id_user) => {
    try {
        await knex.transaction(async (trx) => {
            // Delete all subsections associated with the book
            await trx('public.notes')
                .where('public.notes.id_book', id_book)
                .andWhere('id_user', id_user)
                .del();
            await trx('public.subsections')
                .where('public.subsections.id_book', id_book)
                .andWhere('id_user', id_user)
                .del();

            // Delete all sections associated with the book
            await trx('public.sections')
                .where('public.sections.id_book', id_book)
                .andWhere('id_user', id_user)
                .del();

            // Delete all chapters associated with the book
            await trx('public.chapters')
                .where('public.chapters.id_book', id_book)
                .andWhere('id_user', id_user)
                .del();

            // Delete the book
            await trx('public.books')
                .where('public.books.id', id_book)
                .andWhere('id_user', id_user)
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



exports.getBookById = async (id_book, id_user) =>
    knex("public.books").where('id', id_book).andWhere('id_user', id_user).select()


// CONTENTS 

exports.getContents = async (id_book, id_user) =>
    knex("public.chapters")
        .select('public.chapters.id_book', 'public.chapters.chapter_name', 'public.chapters.id_chapter', 'public.sections.id_section', 'public.sections.section_name', 'public.sections.parent_chapter', 'public.subsections.id_subsection', 'public.subsections.parent_section', 'public.subsections.subsection_name')
        .leftJoin('public.sections', 'public.chapters.id_chapter', '=', 'public.sections.parent_chapter')
        .leftJoin('public.subsections', 'public.sections.id_section', '=', 'public.subsections.parent_section')
        .where('public.chapters.id_book', id_book)
        .andWhere('chapters.id_user', id_user)
        .orderBy('id_chapter')
        .orderBy('id_section')
        .orderBy('id_subsection')



exports.addChapter = async (id_book, chapter_name, id_user) =>
    knex("public.chapters").insert({
        id_book: id_book, chapter_name: chapter_name, id_user: id_user
    })

exports.editChapter = async (id_chapter, chapter_name, id_user) =>
    knex("public.chapters").update({
        chapter_name: chapter_name
    }).where('id_chapter', id_chapter).andWhere('id_user', id_user)



exports.addSection = async (id_book, section_name, parent_chapter, id_user) =>
    knex("public.sections").insert({
        id_book: id_book, section_name: section_name, parent_chapter: parent_chapter, id_user: id_user
    })

exports.editSection = async (id_section, section_name, id_user) =>
    knex("public.sections").update({
        section_name: section_name
    }).where('id_section', id_section).andWhere('id_user', id_user)


exports.addSubsection = async (id_book, subsection_name, parent_section, id_user) =>
    knex("public.subsections").insert({
        id_book: id_book, subsection_name: subsection_name, parent_section: parent_section, id_user: id_user
    })

exports.editSubsection = async (id_subsection, subsection_name, id_user) =>
    knex("public.subsections").update({
        subsection_name: subsection_name
    }).where('id_subsection', id_subsection).andWhere('id_user', id_user)


// NOTES 
exports.countNotes = async (contentsType, id_user) =>
    knex("public.notes").select().where('note_type', contentsType).andWhere('id_user', id_user).count('id_note')


exports.getChapters = async (id_book, id_user) =>
    knex("public.chapters")
        .select()
        .where('public.chapters.id_book', id_book)
        .andWhere('id_user', id_user)
        .orderBy('id_chapter')

exports.getSections = async (id_chapter, id_user) =>
    knex("public.sections")
        .select()
        .where('public.sections.parent_chapter', id_chapter)
        .andWhere('id_user', id_user)
        .orderBy('id_section')

exports.getSubsections = async (id_section, id_user) =>
    knex("public.subsections")
        .select()
        .where('public.subsections.parent_section', id_section)
        .andWhere('id_user', id_user)
        .orderBy('id_subsection')



exports.addNote = async (note_word, note_name, note_description, page, timecode, id_book, parent_structure, parent_type, note_type, id_user) =>
    knex("public.notes").insert({
        note_word: note_word,
        note_name: note_name, note_description: note_description, page: page,
        timecode: timecode, id_book: id_book, parent_structure: parent_structure, parent_type: parent_type, note_type,
        id_user: id_user
    })


exports.editNote = async (id_note, note_word, note_name, note_description, page, timecode, id_book, parent_structure, parent_type, id_user) =>
    knex("public.notes").update({
        note_word: note_word,
        note_name: note_name, note_description: note_description, page: page,
        timecode: timecode, id_book: id_book, parent_structure: parent_structure, parent_type: parent_type
    }).where('id_note', id_note).andWhere('id_user', id_user)


exports.getNotes = async (id_structure, type_structure, contentsType, chosen_page, qnt_per_page, limit, id_user) =>
    knex("public.notes")
        .select()
        .where('public.notes.parent_structure', id_structure)
        .andWhere('public.notes.parent_type', type_structure)
        .andWhere('public.notes.note_type', contentsType)
        .andWhere('id_user', id_user)
        .orderBy('page')
        .orderBy('id_note')
        .offset((chosen_page - 1) * qnt_per_page).limit(Number(limit))

exports.deleteNote = async (id_note, id_user) =>
    knex("public.notes").where('id_note', id_note).andWhere('id_user', id_user).delete()


// VIDEOS
exports.checkVideo = async (id_video, id_user) =>
    knex("public.videos").select().where('id_video', id_video).andWhere('id_user', id_user)

exports.addVideo = async (video_name, video_link, id_user) =>
    knex("public.videos").insert({
        video_name: video_name, video_link: video_link, id_user: id_user
    })
exports.editVideo = async (id_video, video_name, video_link, id_user) =>
    knex("public.videos").update({
        video_name: video_name, video_link: video_link
    }).where('id_video', id_video).andWhere('id_user', id_user)


exports.getVideos = async (chosen_page, qnt_per_page, limit, id_user) =>
    knex("public.videos").select().where('id_user', id_user).orderBy('id_video', 'asc').offset((chosen_page - 1) * qnt_per_page).limit(Number(limit))

exports.countVideos = async (id_user) =>
    knex("public.videos").where('id_user', id_user).select().count('id_video')


exports.deleteVideo = async (id_video, id_user) => {
    try {
        await knex.transaction(async (trx) => {
            // delete video notes
            await trx("public.video_notes")
                .where('id_video', id_video).andWhere('id_user', id_user).del()

            await trx("public.videos")
                .where('id_video', id_video).andWhere('id_user', id_user).del()
            // Commit the transaction
            await trx.commit();
            console.log('Committed successfully');
        });
    } catch (error) {
        console.error('Transaction rolled back due to error:', error);
        throw error;
    }
}


// VIDEO NOTES




exports.addVideoNote = async (video_word, video_phrase, video_explanation, id_video, timecode, note_type, id_user) =>
    knex("public.video_notes").insert({
        video_word: video_word, video_phrase: video_phrase, video_explanation: video_explanation, id_video: id_video, timecode: timecode, note_type: note_type, id_user: id_user
    })


exports.editVideoNote = async (id_note, video_word, video_phrase, video_explanation, id_video, timecode, note_type, id_user) =>
    knex("public.video_notes").update({
        video_word: video_word, video_phrase: video_phrase, video_explanation: video_explanation, id_video: id_video, timecode: timecode, note_type: note_type
    }).where('id_note', id_note).andWhere('id_user', id_user)

exports.getVideoNotes = async (contentsType, chosen_page, qnt_per_page, limit, id_user) =>
    knex("public.video_notes")
        .join('videos', 'video_notes.id_video', '=', 'videos.id_video')
        .select()
        .where('public.video_notes.note_type', contentsType)
        .andWhere('public.video_notes.id_user', id_user)
        .orderBy('id_note')
        .offset((chosen_page - 1) * qnt_per_page).limit(Number(limit))

exports.countVideoNotes = async (contentsType, id_user) =>
    knex("public.video_notes").select().where('note_type', contentsType).andWhere('id_user', id_user).count('id_note')


exports.deleteVideoNote = async (id_note, id_user) =>
    knex("public.video_notes").where('id_note', id_note).andWhere('id_user', id_user).delete()