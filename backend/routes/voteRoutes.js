const express = require("express");
const router = express.Router();
const { submitVote, getVotesStats } = require("../controllers/voteController");

router.post("/vote", submitVote);
router.get("/votes", getVotesStats);

module.exports = router;
