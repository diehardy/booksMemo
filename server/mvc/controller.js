const { response } = require("express");
const Package = require("./package")
const router = require("./router")
const PackageAuth = require("../auth/package")

// USER

// locals user: res.locals.user[0].google_id


class qualityController {
    // middleware
    isAuthenticated = async (req, res, next) => {
        console.log('starting authentication...');

        if (req.isAuthenticated()) {
            res.locals.user = await PackageAuth.checkUser(req.user);
            console.log(`success auth of ${req.user}`)
            return next();
        }
        console.log('not authenticated')
        res.status(401).send('Unauthorized');
    };


    // USER
    async getUserProfile(req, res) {
        try {
            const user = {
                name: res.locals.user[0].name,
                email: res.locals.user[0].email,
                icon: res.locals.user[0].icon
            }
            return res.status(200).json(user)
        } catch (error) {
            console.log('err getUserProfile: ', error);
            return res.status(500).json({ message: "Something went wrong" })
        }
    }


    async logout(req, res) {
        try {
            req.logout(function (err) {
                console.log('starting logout...')
                if (err) {
                    console.log('err: ', err);
                    return res.status(500).json({ message: "Logout failed" });
                }
                req.session.destroy((err) => {
                    if (err) {
                        console.log('session destroy err: ', err)
                        return res.status(500).json({ message: 'Logout failed' })
                    }

                    res.clearCookie("connect.sid");
                    console.log('successful logout')
                    return res.status(200).json({ message: "Logout successful" });

                }



                )



            });
        } catch (error) {
            console.log('err logout: ', error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }



    // BOOKS

    async checkBook(req, res) {
        try {
            let { id_book } = req.body;
            const hasBook = await Package.checkBook(id_book, res.locals.user[0].google_id)
            console.log(`book_id: ${id_book} checked by user ${res.locals.user[0].google_id}`)
            if (hasBook.length > 0) return res.status(200).json(true)
            else return res.status(200).json(false)
        } catch (error) {
            console.log('err checkBook: ', error);
            return res.status(500).json({ message: "Something went wrong" })
        }
    }

    async getBooks(req, res) {
        console.log('locals user: ', res.locals.user[0].google_id)
        const { chosen_page } = req.body
        const qnt_per_page = 5;
        const limit = 5;
        try {
            const all_books = await Package.getBooks(chosen_page, qnt_per_page, limit, res.locals.user[0].google_id);

            for (let i = 0; i < all_books.length; i++) {
                let result = await Package.checkChapter(all_books[i].id, res.locals.user[0].google_id)
                if (result[0]) all_books[i].hasChapter = true
                else all_books[i].hasChapter = false
            }
            let total_pages = await Package.countPages(res.locals.user[0].google_id);
            total_pages[0].count = Math.ceil(total_pages[0].count / qnt_per_page)
            console.log(`a list of books gotten by user ${res.locals.user[0].google_id}`)

            return res.status(200).json({ all_books, pages: total_pages[0].count })
        } catch (error) {
            console.log('err getBooks:', error);
            return res.status(500).json({ message: "Task coudn't be completed." })
        }
    }
    async saveBook(req, res) {
        try {
            let { id, book_name, book_description, is_audiobook, audiobook_source } = req.body;
            if (id) Package.editBook(id, book_name, book_description, is_audiobook, audiobook_source, res.locals.user[0].google_id)
            else Package.addBook(book_name, book_description, is_audiobook, audiobook_source, res.locals.user[0].google_id)
            console.log(`book ${id} has been added by user ${res.locals.user[0].google_id}`)

            return res.status(200).json({ message: 'Book has been added' })
        } catch (error) {
            console.log('err saveBook', error);
            return res.status(500).json({ message: "Book hasn't been added" })
        }
    }

    async deleteBook(req, res) {
        try {
            let { id_book } = req.body;

            await Package.deleteBook(id_book, res.locals.user[0].google_id)
            console.log(`book ${id_book} has been deleted by user ${res.locals.user[0].google_id}`)
            return res.status(200).json({ message: 'Book has been deleted' })
        } catch (error) {
            console.log('err deleteBook: ', error);
            return res.status(500).json({ message: "Book hasn't been added" })
        }
    }


    async deleteContents(req, res) {
        try {
            let { id_contents, type } = req.body;

            switch (type) {
                case 'subsection':
                    await Package.deleteSubsection(id_contents, res.locals.user[0].google_id)
                    break;
                case 'section':
                    await Package.deleteSection(id_contents, res.locals.user[0].google_id)
                    break;
                case 'chapter': await Package.deleteChapter(id_contents, res.locals.user[0].google_id)
                    break;
                default:
                    return res.status(500).json({ message: "Undefined type of content" })
            }

            console.log(`content of type: ${type} and id: ${id_contents} has been deleted by user ${res.locals.user[0].google_id}`)

            return res.status(200).json({ message: 'Contents has been deleted' })
        } catch (error) {
            console.log('err deleteContents: ', error);
            return res.status(500).json({ message: "Contents hasn't been added" })
        }
    }


    async getBookById(req, res) {
        try {
            let { id_book } = req.body;
            const book = await Package.getBookById(id_book, res.locals.user[0].google_id)
            console.log(`book ${id_book} has been asked by user ${res.locals.user[0].google_id}`)
            if (book[0]) return res.status(200).json(book[0])
            else return res.status(404).json({ message: "Book not found" })

        } catch (error) {
            console.log('err getBookById: ', error);
            return res.status(500).json({ message: "Book hasn't been added" })
        }
    }

    // CONTENTS



    async getContents(req, res) {
        try {
            let { id_book } = req.body;

            const chapters = await Package.getContents(id_book, res.locals.user[0].google_id)
            console.log(`contents of id_book: ${id_book} has been asked by user ${res.locals.user[0].google_id}`)

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
            console.log('err getContents: ', error);
            return res.status(500).json({ message: "Error happened" })
        }
    }



    async saveContents(req, res) {
        try {
            let { id_contents, name_contents, parent_id, type, id_book } = req.body;


            switch (type) {
                case 'chapter':
                    if (id_contents) Package.editChapter(id_contents, name_contents, res.locals.user[0].google_id)
                    else Package.addChapter(id_book, name_contents, res.locals.user[0].google_id)
                    break;
                case 'section':
                    if (id_contents) Package.editSection(id_contents, name_contents, res.locals.user[0].google_id)
                    else Package.addSection(id_book, name_contents, parent_id, res.locals.user[0].google_id)
                    break;
                case 'subsection':
                    if (id_contents) Package.editSubsection(id_contents, name_contents, res.locals.user[0].google_id)
                    else Package.addSubsection(id_book, name_contents, parent_id, res.locals.user[0].google_id)
                    break;
                default:
                    return res.status(500).json({ message: "Undefined type of content" })
            }
            console.log(`contents id: ${id_contents} with type: ${type} has been added by user ${res.locals.user[0].google_id}`)

            return res.status(200).json({ message: 'Content has been added' })
        } catch (error) {
            console.log('err saveContents', error);
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
                    contents = await Package.getChapters(id_book, res.locals.user[0].google_id)
                    break;
                case 'section':
                    contents = await Package.getSections(id_structure, res.locals.user[0].google_id)
                    break;
                case 'subsection':
                    contents = await Package.getSubsections(id_structure, res.locals.user[0].google_id)
                    break;
                default:
                    return res.status(500).json({ message: "Undefined type of content" })
            }
            console.log(`contents id: ${id_structure} with type: ${type} has been gotten by user ${res.locals.user[0].google_id}`)
            return res.status(200).json({ contents })
        } catch (error) {
            console.log('err getContentsById: ', error);
            return res.status(500).json({ message: "Contents is not found" })
        }
    }


    async saveNote(req, res) {
        try {
            let { id_note, note_word, note_name, note_description, page, timecode, id_book, parent_structure, parent_type, note_type } = req.body;
            if (id_note) Package.editNote(id_note, note_word, note_name, note_description, page, timecode, id_book, parent_structure, parent_type, res.locals.user[0].google_id)
            else Package.addNote(note_word, note_name, note_description, page, timecode, id_book, parent_structure, parent_type, note_type, res.locals.user[0].google_id)
            console.log(`note id: ${id_note} has been changed by user ${res.locals.user[0].google_id}`)
            return res.status(200).json({ message: 'Note has been added' })
        } catch (error) {
            console.log('err saveNote: ', error);
            return res.status(500).json({ message: "Note hasn't been added" })
        }
    }


    async getNotes(req, res) {
        const { parent_structure, parent_type, contentsType, chosen_page } = req.body
        const qnt_per_page = 5;
        const limit = 5;
        try {
            const all_notes = await Package.getNotes(parent_structure, parent_type, contentsType, chosen_page, qnt_per_page, limit, res.locals.user[0].google_id);

            let total_pages = await Package.countNotes(contentsType, res.locals.user[0].google_id);
            total_pages[0].count = Math.ceil(total_pages[0].count / qnt_per_page)
            console.log(`all notes of parent_id: ${parent_structure} and type: ${parent_type} has been gotten by user ${res.locals.user[0].google_id}`)
            return res.status(200).json({ notes: all_notes, pages: total_pages[0].count })
        } catch (error) {
            console.log('err getNotes: ', error);
            return res.status(500).json({ message: "Task coudn't be completed." })
        }
    }

    async deleteNote(req, res) {
        try {
            let { id_note } = req.body;

            await Package.deleteNote(id_note, res.locals.user[0].google_id)
            console.log(`note id: ${id_note} has been deleted by user ${res.locals.user[0].google_id}`)
            return res.status(200).json({ message: 'Note has been deleted' })
        } catch (error) {
            console.log('err deleteNote: ', error);
            return res.status(500).json({ message: "Note hasn't been added" })
        }
    }


    // VIDEOS


    async saveVideo(req, res) {
        try {
            let { id_video, video_name, video_link } = req.body;

            if (id_video) Package.editVideo(id_video, video_name, video_link, res.locals.user[0].google_id)
            else Package.addVideo(video_name, video_link, res.locals.user[0].google_id)
            console.log(`video id: ${id_video} has been changed by user ${res.locals.user[0].google_id}`)
            return res.status(200).json({ message: 'Video has been added or changed' })
        } catch (error) {
            console.log('err saveVideo: ', error);
            return res.status(500).json({ message: "Video hasn't been added" })
        }
    }

    async checkVideo(req, res) {
        try {
            let { id_video } = req.body;

            const hasVideo = await Package.checkVideo(id_video, res.locals.user[0].google_id)
            console.log(`video id: ${id_video} has been checked by user ${res.locals.user[0].google_id}`)
            if (hasVideo.length > 0) return res.status(200).json(true)
            else return res.status(200).json(false)
        } catch (error) {
            console.log('err checkVideo: ', error);
            return res.status(500).json({ message: "Something went wrong" })
        }
    }


    async getVideos(req, res) {
        const { chosen_page } = req.body
        const qnt_per_page = 5;
        const limit = 5;
        try {
            const all_videos = await Package.getVideos(chosen_page, qnt_per_page, limit, res.locals.user[0].google_id);

            let total_pages = await Package.countVideos(res.locals.user[0].google_id);
            total_pages[0].count = Math.ceil(total_pages[0].count / qnt_per_page)
            console.log(`list of videos has been asked by user ${res.locals.user[0].google_id}`)
            return res.status(200).json({ videos: all_videos, pages: total_pages[0].count })
        } catch (error) {
            console.log('err getVideos: ', error);
            return res.status(500).json({ message: "Task coudn't be completed." })
        }
    }

    async deleteVideo(req, res) {
        try {
            let { id_video } = req.body;

            await Package.deleteVideo(id_video, res.locals.user[0].google_id)
            console.log(`video id: ${id_video} has been delted by user ${res.locals.user[0].google_id}`)
            return res.status(200).json({ message: 'Video has been deleted' })
        } catch (error) {
            console.log('err deleteVideo: ', error);
            return res.status(500).json({ message: "Video hasn't been added" })
        }
    }

    // VIDEO NOTES
    async saveVideoNote(req, res) {
        try {
            let { id_note, video_word, video_phrase, video_explanation, id_video, timecode, note_type } = req.body;
            if (id_note) Package.editVideoNote(id_note, video_word, video_phrase, video_explanation, id_video, timecode, note_type, res.locals.user[0].google_id)
            else Package.addVideoNote(video_word, video_phrase, video_explanation, id_video, timecode, note_type, res.locals.user[0].google_id)
            console.log(`video note id: ${id_note} has been added by user ${res.locals.user[0].google_id}`)
            return res.status(200).json({ message: 'Note has been added' })
        } catch (error) {
            console.log('err saveVideoNote: ', error);
            return res.status(500).json({ message: "Note hasn't been added" })
        }
    }


    async getVideoNotes(req, res) {
        const { contentsType, chosen_page } = req.body
        const qnt_per_page = 5;
        const limit = 5;
        try {
            const all_notes = await Package.getVideoNotes(contentsType, chosen_page, qnt_per_page, limit, res.locals.user[0].google_id);

            let total_pages = await Package.countVideoNotes(contentsType, res.locals.user[0].google_id);
            total_pages[0].count = Math.ceil(total_pages[0].count / qnt_per_page)
            console.log(`list of notes has been asked by user ${res.locals.user[0].google_id}`)
            return res.status(200).json({ notes: all_notes, pages: total_pages[0].count })
        } catch (error) {
            console.log('err getVideoNotes: ', error);
            return res.status(500).json({ message: "Task coudn't be completed." })
        }
    }



    async deleteVideoNote(req, res) {
        try {
            let { id_note } = req.body;

            await Package.deleteVideoNote(id_note, res.locals.user[0].google_id)
            console.log(`video note id: ${id_note} has been deletedd by user ${res.locals.user[0].google_id}`)
            return res.status(200).json({ message: 'Note has been deleted' })
        } catch (error) {
            console.log('err deleteVideoNotes: ', error);
            return res.status(500).json({ message: "Note hasn't been deleted" })
        }
    }

}

module.exports = new qualityController();


