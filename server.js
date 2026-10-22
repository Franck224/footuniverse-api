
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.json({
    app: "FootUniverse",
    status: "online",
    message: "Le serveur FootUniverse fonctionne !"
  });
});

app.get("/fixtures", async (req, res) => {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "La clé API-Football n'est pas encore configurée sur Render."
    });
  }

  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);

    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${date}`,
      {
        headers: {
          "x-apisports-key": apiKey
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erreur de l'API-Football",
        details: data
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Impossible de récupérer les matchs."
    });
  }
});

app.listen(PORT, () => {
  console.log(`FootUniverse API démarrée sur le port ${PORT}`);
});
