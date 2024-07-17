const { response } = require("express");
const Package = require("./package")
const router = require("./router")
const PackageAuth = require("../auth/package")




class qualityController {
    // middleware
    isAuthenticated = async (req, res, next) => {
        console.log('starting authentication...');
        console.log('req.user: ', req.user); // Add this line

        if (req.isAuthenticated()) {
            res.locals.user = await PackageAuth.checkUser(req.user);
            console.log(`success auth of ${req.user}`)
            return next();
        }
        res.status(401).send('Unauthorized');
    };




    // BOOKS

    async checkBook(req, res) {
        try {
            let { id_book } = req.body;

            const hasBook = await Package.checkBook(id_book)
            if (hasBook.length > 0) return res.status(200).json(true)
            else return res.status(200).json(false)
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" })
        }
    }

    async getBooks(req, res) {
        console.log('locals user: ', res.locals.user)
        const { chosen_page } = req.body
        const qnt_per_page = 5;
        const limit = 5;
        try {
            const all_books = await Package.getBooks(chosen_page, qnt_per_page, limit);

            for (let i = 0; i < all_books.length; i++) {
                console.log(all_books[i].id)
                let result = await Package.checkChapter(all_books[i].id)
                console.log(result)
                if (result[0]) all_books[i].hasChapter = true
                else all_books[i].hasChapter = false
            }
            let total_pages = await Package.countPages();
            total_pages[0].count = Math.ceil(total_pages[0].count / qnt_per_page)
            return res.status(200).json({ all_books, pages: total_pages[0].count })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Task coudn't be completed." })
        }
    }
    async saveBook(req, res) {
        try {
            let { id, book_name, book_description, is_audiobook, audiobook_source } = req.body;
            if (id) Package.editBook(id, book_name, book_description, is_audiobook, audiobook_source)
            else Package.addBook(book_name, book_description, is_audiobook, audiobook_source)

            return res.status(200).json({ message: 'Book has been added' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Book hasn't been added" })
        }
    }

    async deleteBook(req, res) {
        try {
            let { id_book } = req.body;

            await Package.deleteBook(id_book)
            return res.status(200).json({ message: 'Book has been deleted' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Book hasn't been added" })
        }
    }


    async deleteContents(req, res) {
        try {
            let { id_contents, type } = req.body;

            switch (type) {
                case 'subsection':
                    await Package.deleteSubsection(id_contents)
                    break;
                case 'section':
                    await Package.deleteSection(id_contents)
                    break;
                case 'chapter': await Package.deleteChapter(id_contents)
                    break;
                default:
                    return res.status(500).json({ message: "Undefined type of content" })
            }


            return res.status(200).json({ message: 'Book has been deleted' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Book hasn't been added" })
        }
    }


    async getBookById(req, res) {
        try {
            let { id_book } = req.body;

            const book = await Package.getBookById(id_book)
            if (book[0]) return res.status(200).json(book[0])
            else return res.status(404).json({ message: "Book not found" })

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Book hasn't been added" })
        }
    }

    // CONTENTS



    async getContents(req, res) {
        try {
            let { id_book } = req.body;

            const chapters = await Package.getContents(id_book)

            let contents = {};
            chapters.forEach((row) => {
                //console.log('row:', row)
                // checking chapters
                if (!contents[`chapter_${row.id_chapter}`]) {
                    contents[`chapter_${row.id_chapter}`] = {
                        id_chapter: row.id_chapter,
                        chapter_name: row.chapter_name,
                        sections: {}
                    }
                }
                // checking sections
                if (!contents[`chapter_${row.id_chapter}`].sections[`section_${row.id_section}`] && row.id_section) {
                    contents[`chapter_${row.id_chapter}`].sections[`section_${row.id_section}`] = {
                        id_section: row.id_section,
                        section_name: row.section_name,
                        subsections: {}
                    }
                }

                // checking subsections
                if (row.id_subsection) {
                    if (!contents[`chapter_${row.id_chapter}`].sections[`section_${row.id_section}`].subsections[`subsection_${row.id_subsection}`]) {
                        contents[`chapter_${row.id_chapter}`].sections[`section_${row.id_section}`].subsections[`subsection_${row.id_subsection}`] = {
                            id_subsection: row.id_subsection,
                            subsection_name: row.subsection_name,
                        }
                    }
                }



            })
            if (chapters[0]) return res.status(200).json(contents)
            else return res.status(404).json({ message: "No contents" })

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error happened" })
        }
    }



    async saveContents(req, res) {
        try {
            let { id_contents, name_contents, parent_id, type, id_book } = req.body;


            switch (type) {
                case 'chapter':
                    if (id_contents) Package.editChapter(id_contents, name_contents)
                    else Package.addChapter(id_book, name_contents)
                    break;
                case 'section':
                    if (id_contents) Package.editSection(id_contents, name_contents)
                    else Package.addSection(id_book, name_contents, parent_id)
                    break;
                case 'subsection':
                    if (id_contents) Package.editSubsection(id_contents, name_contents)
                    else Package.addSubsection(id_book, name_contents, parent_id)
                    break;
                default:
                    return res.status(500).json({ message: "Undefined type of content" })
            }

            return res.status(200).json({ message: 'Content has been added' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Content hasn't been added" })
        }
    }


    // NOTES 

    // get all chapters, sections, subsections by book id or chapter/section id
    async getContentsById(req, res) {
        try {
            let { id_book, id_structure, type } = req.body;
            let contents = '';

            switch (type) {
                case 'chapter':
                    contents = await Package.getChapters(id_book)
                    break;
                case 'section':
                    contents = await Package.getSections(id_structure)
                    break;
                case 'subsection':
                    contents = await Package.getSubsections(id_structure)
                    break;
                default:
                    return res.status(500).json({ message: "Undefined type of content" })
            }

            return res.status(200).json({ contents })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Contents is not found" })
        }
    }


    async saveNote(req, res) {
        try {
            let { id_note, note_word, note_name, note_description, page, timecode, id_book, parent_structure, parent_type, note_type } = req.body;
            console.log('id_note: ', req.body)
            if (id_note) Package.editNote(id_note, note_word, note_name, note_description, page, timecode, id_book, parent_structure, parent_type)
            else Package.addNote(note_word, note_name, note_description, page, timecode, id_book, parent_structure, parent_type, note_type)

            return res.status(200).json({ message: 'Note has been added' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Note hasn't been added" })
        }
    }


    async getNotes(req, res) {
        const { parent_structure, parent_type, contentsType, chosen_page } = req.body
        const qnt_per_page = 5;
        const limit = 5;
        try {
            const all_notes = await Package.getNotes(parent_structure, parent_type, contentsType, chosen_page, qnt_per_page, limit);

            let total_pages = await Package.countNotes(contentsType);
            total_pages[0].count = Math.ceil(total_pages[0].count / qnt_per_page)
            console.log('pages: ', total_pages)
            return res.status(200).json({ notes: all_notes, pages: total_pages[0].count })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Task coudn't be completed." })
        }
    }

    async deleteNote(req, res) {
        try {
            let { id_note } = req.body;

            await Package.deleteNote(id_note)
            return res.status(200).json({ message: 'Note has been deleted' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Note hasn't been added" })
        }
    }


    // VIDEOS


    async saveVideo(req, res) {
        try {
            let { id_video, video_name, video_link } = req.body;

            if (id_video) Package.editVideo(id_video, video_name, video_link)
            else Package.addVideo(video_name, video_link)

            return res.status(200).json({ message: 'Video has been added' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Video hasn't been added" })
        }
    }

    async checkVideo(req, res) {
        try {
            let { id_video } = req.body;

            const hasVideo = await Package.checkVideo(id_video)
            if (hasVideo.length > 0) return res.status(200).json(true)
            else return res.status(200).json(false)
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" })
        }
    }


    async getVideos(req, res) {
        const { chosen_page } = req.body
        const qnt_per_page = 5;
        const limit = 5;
        try {
            const all_videos = await Package.getVideos(chosen_page, qnt_per_page, limit);

            let total_pages = await Package.countVideos();
            total_pages[0].count = Math.ceil(total_pages[0].count / qnt_per_page)
            console.log('pages: ', total_pages)
            return res.status(200).json({ videos: all_videos, pages: total_pages[0].count })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Task coudn't be completed." })
        }
    }

    async deleteVideo(req, res) {
        try {
            let { id_video } = req.body;

            await Package.deleteVideo(id_video)
            return res.status(200).json({ message: 'Video has been deleted' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Video hasn't been added" })
        }
    }

    // VIDEO NOTES
    async saveVideoNote(req, res) {
        try {
            console.log(req.body)
            let { id_note, video_word, video_phrase, video_explanation, id_video, timecode, note_type } = req.body;
            if (id_note) Package.editVideoNote(id_note, video_word, video_phrase, video_explanation, id_video, timecode, note_type)
            else Package.addVideoNote(video_word, video_phrase, video_explanation, id_video, timecode, note_type)
            return res.status(200).json({ message: 'Note has been added' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Note hasn't been added" })
        }
    }


    async getVideoNotes(req, res) {
        const { contentsType, chosen_page } = req.body
        const qnt_per_page = 5;
        const limit = 5;
        try {
            const all_notes = await Package.getVideoNotes(contentsType, chosen_page, qnt_per_page, limit);

            let total_pages = await Package.countVideoNotes(contentsType);
            total_pages[0].count = Math.ceil(total_pages[0].count / qnt_per_page)
            console.log('pages: ', total_pages)
            return res.status(200).json({ notes: all_notes, pages: total_pages[0].count })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Task coudn't be completed." })
        }
    }



    async deleteVideoNote(req, res) {
        try {
            let { id_note } = req.body;

            await Package.deleteVideoNote(id_note)
            return res.status(200).json({ message: 'Note has been deleted' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Note hasn't been added" })
        }
    }

}

module.exports = new qualityController();


