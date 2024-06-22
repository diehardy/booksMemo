const { response } = require("express");
const Package = require("./package")
const router = require("./router")


class qualityController {
    async selectAll(req, res) {
        try {
            const out_bd = await Package.all_select();
            console.log(out_bd);
            return res.status(200).json({ out_bd })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Не удалось выполнить задачу" })
        }
    }



}

module.exports = new qualityController();


