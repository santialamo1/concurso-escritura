const Vote = require("../models/Vote");
const { getSheetData } = require("./sheetController");
const axios = require("axios");
const Papa = require("papaparse");

const SHEET_URL = process.env.SHEET_URL;

/* Sección: Guardar un voto único */
exports.submitVote = async (req, res) => {
  try {
    const { discordId, vote, username } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Validación de campos requeridos
    if (!discordId || !vote || !username)
      return res
        .status(400)
        .json({ error: "Voto inválido. Se requiere participante, Discord ID y username." });

    // Verificar si ya se votó desde esta IP o cuenta
    const existing = await Vote.findOne({
      $or: [{ discordId }, { ip }],
    });
    if (existing)
      return res.status(400).json({ error: "Ya se ha registrado un voto desde esta IP o cuenta." });

    // Obtener datos del spreadsheet
    const sheetData = await getSheetDataInternal();
    if (!sheetData.ready)
      return res.status(400).json({ error: "Datos aún no disponibles." });

    // Validar que el voto sea por un participante válido
    const validNames = sheetData.participants.map((p) => p.name);
    if (!validNames.includes(vote))
      return res.status(400).json({ error: "Participante inválido." });

    // Guardar el voto
    const voteDoc = new Vote({ discordId, vote, username, ip });
    await voteDoc.save();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Error al guardar el voto." });
  }
};

/* Sección: Obtener ranking por cantidad de votos únicos */
exports.getVotesStats = async (req, res) => {
  try {
    const votes = await Vote.find({});
    const sheetData = await getSheetDataInternal();
    if (!sheetData.ready) return res.json({ ready: false });

    // Inicializar contador por participante
    const participants = sheetData.participants.map((p) => p.name);
    const stats = {};
    participants.forEach((name) => (stats[name] = 0));

    // Contar votos válidos
    votes.forEach((v) => {
      if (stats[v.vote] !== undefined) {
        stats[v.vote] += 1;
      }
    });

    // Generar ranking ordenado
    const ranking = Object.entries(stats)
      .map(([name, count]) => ({ name, votes: count }))
      .filter((p) => p.votes > 0)
      .sort((a, b) => b.votes - a.votes);

    return res.json({ ready: true, ranking });
  } catch (err) {
    return res.status(500).json({ error: "Error al calcular estadísticas" });
  }
};

/* Sección: Función interna para obtener datos del spreadsheet */
async function getSheetDataInternal() {
  const response = await axios.get(SHEET_URL);
  const parsed = Papa.parse(response.data, { header: false }).data;

  // Validar celda de control W1
  const condCell = parsed[0][22];
  if (condCell !== "1") return { ready: false };

  // Extraer nombres de RM y criterios
  const rmRow = (parsed[0] || []).slice(1, 21);
  const criteriaRow = (parsed[1] || []).slice(1, 21);

  const rmNames = rmRow.filter((c) => c && String(c).trim() !== "");
  const criteriaCount =
    rmNames.length > 0 ? Math.floor(criteriaRow.length / rmNames.length) : 1;

  const rmBlocks = [];
  for (const cell of rmRow) {
    if (cell && String(cell).trim() !== "")
      rmBlocks.push({ name: String(cell).trim(), colSpan: criteriaCount });
  }

  // Extraer participantes y puntajes
  const participants = (parsed.slice(3) || [])
    .filter((row) => row && row[0] && String(row[0]).trim() !== "")
    .map((row) => ({
      name: String(row[0]).trim(),
      scores: (row.slice(1, 21) || []).map((c) => c ?? ""),
    }));

  return { ready: true, rmBlocks, criteria: criteriaRow, participants };
}
