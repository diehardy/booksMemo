const Router = require("express");
const router = new Router();
const controller = require("./controller");

router.get("/get", controller.getBooks);

router.post("/add", controller.addBook);
module.exports = router;