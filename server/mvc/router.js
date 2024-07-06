const Router = require("express");
const router = new Router();
const controller = require("./controller");


// BOOKS
router.post("/get", controller.getBooks);

router.post("/get-by-id", controller.getBookById);

router.post("/save", controller.saveBook);

router.post("/delete", controller.deleteBook);



// CONTENTS

router.post("/get-contents", controller.getContents);

router.post("/save-contents", controller.saveContents);


router.post("/delete-contents", controller.deleteContents);


// NOTES
router.post("/get-contents-by-id", controller.getContentsById);

router.post("/save-note", controller.saveNote);







module.exports = router;