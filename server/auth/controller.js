const { response } = require("express");
const Package = require("./package")
const router = require("./router")








class qualityController {

    async authStart(req, res) {
        try {


            return res.status(200).json({ user: 'success' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" })
        }
    }


    async authCallback(req, res) {
        try {
            console.log('req:', req.body)


            return res.status(200).json({ user: 'req.body' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" })
        }
    }


}

module.exports = new qualityController();


