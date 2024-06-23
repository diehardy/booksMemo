const { response } = require("express");
const Package = require("./package")
const router = require("./router")


class qualityController {
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
    async addBook(req, res) {
        try {
            let { book_name, book_description, is_audiobook, audiobook_source } = req.body;

            Package.addBook(book_name, book_description, is_audiobook, audiobook_source)
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

}

module.exports = new qualityController();


