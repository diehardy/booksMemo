const { response } = require("express");
const Package = require("./package")
const router = require("./router")


class qualityController {


    // BOOKS
    async getBooks(req, res) {
        const { chosen_page } = req.body
        const qnt_per_page = 5;
        const limit = 5;
        try {
            const all_books = await Package.getBooks(chosen_page, qnt_per_page, limit);
            let total_pages = await Package.countPages();
            console.log(total_pages[0].count)
            total_pages[0].count = Math.ceil(total_pages[0].count / qnt_per_page)
            console.log('pages:', total_pages);
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

            const chapters = await Package.getChapters(id_book)

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
            else return res.status(404).json({ message: "No chapters" })

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Book hasn't been added" })
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

}

module.exports = new qualityController();


