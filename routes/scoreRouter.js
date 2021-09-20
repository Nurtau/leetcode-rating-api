const express = require('express');

const scoreController = require("../controllers/scoreController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();


router.get("/rating", scoreController.getRating);
router.patch("/reset-scores", isAuthenticated, scoreController.resetScores);
router.patch("/update-scores", scoreController.updateScores);


module.exports = router;