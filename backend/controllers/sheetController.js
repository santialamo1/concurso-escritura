const axios = require("axios");
const Papa = require("papaparse");

const SHEET_URL = process.env.SHEET_URL;

// 🧩 Sección: Endpoint para obtener datos del spreadsheet
exports.getSheetData = async (req, res) => {
  try {
    // 🧩 Descarga del contenido CSV desde la URL configurada
    const response = await axios.get(SHEET_URL);
    const parsed = Papa.parse(response.data, { header: false }).data;

    // 🧩 Validación: contenido mínimo esperado
    if (!parsed || parsed.length < 3) {
      return res.status(500).json({ error: "Spreadsheet vacío o formato inesperado" });
    }

    // 🧩 Validación: celda de control W1 debe ser "1"
    const condCell = parsed[0][22]; // W1
    if (condCell !== "1") {
      return res.json({ ready: false });
    }

    // 🧩 Extracción de nombres de RM y criterios
    const rmRow = (parsed[0] || []).slice(1, 21);
    const criteriaRow = (parsed[1] || []).slice(1, 21);

    const rmNames = rmRow.filter(c => c && String(c).trim() !== "");
    const criteriaCount = rmNames.length > 0 ? Math.floor(criteriaRow.length / rmNames.length) : 1;

    // 🧩 Construcción de bloques RM con colSpan
    const rmBlocks = [];
    for (const cell of rmRow) {
      if (cell && String(cell).trim() !== "") {
        rmBlocks.push({ name: String(cell).trim(), colSpan: criteriaCount });
      }
    }

    // 🧩 Extracción de participantes y sus puntajes
    const participants = (parsed.slice(3) || [])
      .filter(row => row && row[0] && String(row[0]).trim() !== "")
      .map(row => ({
        name: String(row[0]).trim(),
        scores: (row.slice(1, 21) || []).map(c => c ?? "")
      }));

    // 🧩 Respuesta con datos procesados
    return res.json({ ready: true, rmBlocks, criteria: criteriaRow, participants });

  } catch (err) {
    // 🧩 Error al leer o procesar el spreadsheet
    return res.status(500).json({ error: "Error al leer el spreadsheet" });
  }
};
