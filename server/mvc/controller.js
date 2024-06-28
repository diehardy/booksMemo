const { response } = require("express");
const Package = require("./package")
const router = require("./router")


class qualityController {


    // BOOKS
    async getBooks(req, res) {
        try {
            const all_books = await Package.getBooks();
            console.log(all_books);
            return res.status(200).json({ all_books })
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

            Package.deleteBook(id_book)
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



    async getChapters(req, res) {
        try {
            let { id_book } = req.body;

            const chapters = await Package.getChapters(id_book)

            let contents = {};
            chapters.forEach((row) => {
                console.log('row:', row)
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





}

module.exports = new qualityController();


