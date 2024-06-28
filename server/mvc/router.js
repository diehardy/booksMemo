const Router = require("express");
const router = new Router();
const controller = require("./controller");


// BOOKS
router.get("/get", controller.getBooks);

router.post("/get-by-id", controller.getBookById);

router.post("/save", controller.saveBook);

router.post("/delete", controller.deleteBook);



// CONTENTS

router.post("/get-chapters", controller.getChapters);




module.exports = router;