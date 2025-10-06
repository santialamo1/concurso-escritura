const axios = require("axios");
const qs = require("qs");
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = require("../authConfig");

// Cache temporal en memoria
const recentAttempts = new Map();

exports.discordCallback = async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const cacheKey = `${ip}-${code}`;

  console.log("[discordCallback] IP del cliente:", ip);

  // Validar si el usuario canceló la autorización
  if (error === "access_denied") {
    console.warn("[discordCallback] Usuario canceló la autorización en Discord");
    return res.status(403).json({ error: "Autenticación cancelada por el usuario" });
  }

  // Validar si falta el código
  if (!code) {
    console.warn("[discordCallback] No se recibió código en la URL");
    return res.status(400).json({ error: "Falta el código de autorización" });
  }

  // Verificar si ya se intentó este código desde esta IP
  if (recentAttempts.has(cacheKey)) {
    console.warn("[discordCallback] Reintento detectado desde misma IP con mismo código:", cacheKey);
    return res.status(429).json({ error: "Este código ya fue procesado desde tu IP" });
  }

  try {
    // Marcar intento en cache por 5 minutos
    recentAttempts.set(cacheKey, true);
    setTimeout(() => recentAttempts.delete(cacheKey), 5 * 60 * 1000);

    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      console.error("[discordCallback] No se recibió access_token");
      return res.status(500).json({ error: "No se pudo obtener el token de acceso" });
    }

    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const discordId = userResponse.data.id;
    const username = userResponse.data.username;

    if (!discordId || !username) {
      console.error("[discordCallback] No se recibió discordId o username");
      return res.status(500).json({ error: "No se pudo obtener los datos de Discord" });
    }

    console.log("[discordCallback] Enviando discordId y username al frontend:", discordId, username);
    return res.json({ discordId, username });

  } catch (err) {
    const safeDetails = err.response?.data || err.message || "Error desconocido";

    if (err.response?.data?.error === "invalid_grant") {
      console.warn("[discordCallback] Código ya usado o expirado:", code);
    }

    console.error("[discordCallback] Error en OAuth Discord:", safeDetails);
    return res.status(500).json({
      error: "Error en OAuth Discord",
      details: typeof safeDetails === "object" ? JSON.stringify(safeDetails) : safeDetails,
    });
  }
};
