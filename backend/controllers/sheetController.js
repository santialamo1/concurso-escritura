const axios = require("axios");
const Papa = require("papaparse");

const SHEET_URL = process.env.SHEET_URL;

exports.getSheetData = async (req, res) => {
  try {
    const response = await axios.get(SHEET_URL);
    const parsed = Papa.parse(response.data, { header: false }).data;

    if (!parsed || parsed.length < 3) return res.status(500).json({ error: "Spreadsheet vacío o formato inesperado" });

    const condCell = parsed[0][22]; // W1
    if (condCell !== "1") return res.json({ ready: false });

    const rmRow = (parsed[0] || []).slice(1, 21);
    const criteriaRow = (parsed[1] || []).slice(1, 21);

    const rmNames = rmRow.filter(c => c && String(c).trim() !== "");
    const criteriaCount = rmNames.length > 0 ? Math.floor(criteriaRow.length / rmNames.length) : 1;

    const rmBlocks = [];
    for (const cell of rmRow) {
      if (cell && String(cell).trim() !== "") rmBlocks.push({ name: String(cell).trim(), colSpan: criteriaCount });
    }

    const participants = (parsed.slice(3) || [])
      .filter(row => row && row[0] && String(row[0]).trim() !== "")
      .map(row => ({
        name: String(row[0]).trim(),
        scores: (row.slice(1, 21) || []).map(c => c ?? "")
      }));

    return res.json({ ready: true, rmBlocks, criteria: criteriaRow, participants });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al leer el spreadsheet" });
  }
};
