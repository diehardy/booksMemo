const Router = require("express");
const router = new Router();
const controller = require("./controller");


// BOOKS
router.post("/get", controller.isAuthenticated, controller.getBooks);

router.post("/get-by-id", controller.isAuthenticated, controller.getBookById);

router.post("/save", controller.isAuthenticated, controller.saveBook);

router.post("/delete", controller.isAuthenticated, controller.deleteBook);

router.post("/check-book", controller.isAuthenticated, controller.checkBook);

// CONTENTS

router.post("/get-contents", controller.isAuthenticated, controller.getContents);

router.post("/save-contents", controller.isAuthenticated, controller.saveContents);


router.post("/delete-contents", controller.isAuthenticated, controller.deleteContents);


// NOTES
router.post("/get-contents-by-id", controller.isAuthenticated, controller.getContentsById);

router.post("/save-note", controller.isAuthenticated, controller.saveNote);

router.post("/get-notes", controller.isAuthenticated, controller.getNotes);
router.post("/delete-note", controller.isAuthenticated, controller.deleteNote);


// VIDEOS
router.post("/get-videos", controller.isAuthenticated, controller.getVideos);

router.post("/save-video", controller.isAuthenticated, controller.saveVideo);


router.post("/delete-video", controller.isAuthenticated, controller.deleteVideo);

router.post("/check-video", controller.isAuthenticated, controller.checkVideo);

// VIDEO NOTES
router.post("/save-video-note", controller.isAuthenticated, controller.saveVideoNote);

router.post("/get-video-notes", controller.isAuthenticated, controller.getVideoNotes);
router.post("/delete-video-note", controller.isAuthenticated, controller.deleteVideoNote);


module.exports = router;