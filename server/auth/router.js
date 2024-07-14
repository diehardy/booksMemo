const Router = require("express");
const router = new Router();
const controller = require("./controller");


// Auth
router.post("/getUsers", controller.getUsers);


module.exports = router;