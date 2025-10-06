const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

// Conexión Mongo
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error MongoDB:", err));

// Rutas
app.use("/api", require("./routes/sheetRoutes"));
app.use("/api", require("./routes/voteRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
