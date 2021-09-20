const express = require("express");

const userController = require("../controllers/userController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/add-user", userController.addUser);
router.get("/users", userController.getUsers);
router.delete("/users/:username", isAuthenticated, userController.deleteUser);
router.patch("/update-username", isAuthenticated, userController.updateUsername);

module.exports = router;
