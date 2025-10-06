const axios = require("axios");
const qs = require("qs");
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = require("../authConfig");

// 🧩 Sección: Cache temporal para evitar reintentos desde misma IP
const recentAttempts = new Map();

// 🧩 Sección: Callback de autenticación Discord
exports.discordCallback = async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const cacheKey = `${ip}-${code}`;

  // 🧩 Validación: Usuario canceló la autorización
  if (error === "access_denied") {
    return res.status(403).json({ error: "Autenticación cancelada por el usuario" });
  }

  // 🧩 Validación: Falta el código
  if (!code) {
    return res.status(400).json({ error: "Falta el código de autorización" });
  }

  // 🧩 Validación: Reintento desde misma IP con mismo código
  if (recentAttempts.has(cacheKey)) {
    return res.status(429).json({ error: "Este código ya fue procesado desde tu IP" });
  }

  try {
    // 🧩 Registro en cache por 5 minutos
    recentAttempts.set(cacheKey, true);
    setTimeout(() => recentAttempts.delete(cacheKey), 5 * 60 * 1000);

    // 🧩 Solicitud de token de acceso a Discord
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
      return res.status(500).json({ error: "No se pudo obtener el token de acceso" });
    }

    // 🧩 Solicitud de datos del usuario autenticado
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const discordId = userResponse.data.id;
    const username = userResponse.data.username;

    if (!discordId || !username) {
      return res.status(500).json({ error: "No se pudo obtener los datos de Discord" });
    }

    // 🧩 Respuesta exitosa al frontend
    return res.json({ discordId, username });

  } catch (err) {
    const safeDetails = err.response?.data || err.message || "Error desconocido";

    // 🧩 Validación: Código expirado o ya usado
    if (err.response?.data?.error === "invalid_grant") {
      // Silencioso
    }

    // 🧩 Respuesta de error genérica
    return res.status(500).json({
      error: "Error en OAuth Discord",
      details: typeof safeDetails === "object" ? JSON.stringify(safeDetails) : safeDetails,
    });
  }
};
