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
            let { book_name, book_description } = req.body;

            Package.addBook(book_name, book_description)
            return res.status(200).json({ message: 'Book has been added' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Book hasn't been added" })
        }
    }


}

module.exports = new qualityController();


