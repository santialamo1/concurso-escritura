const express = require("express");
const router = express.Router();
const { getSheetData } = require("../controllers/sheetController");

router.get("/sheet", getSheetData);

module.exports = router;
