var express = require('express');
var router = express.Router();

var user_controller = require("../controllers/user-controller");

router.post("/",user_controller.createUser);
router.get("/",user_controller.getAlluser);
router.get("/:id",user_controller.getUser);
router.delete("/:id",user_controller.deleteUser);
router.post("/auth", user_controller.authenticateUser);
router.put("/:id", user_controller.updateUser);



module.exports = router;