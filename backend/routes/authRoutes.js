// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { discordCallback } = require("../controllers/authController");

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI; // sin encode aquí
const OAUTH_SCOPE = "identify";

router.get("/discord", (req, res) => {
  const discordAuthURL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${OAUTH_SCOPE}`;
  res.redirect(discordAuthURL);
});

router.get("/discord/callback", discordCallback);

module.exports = router;
