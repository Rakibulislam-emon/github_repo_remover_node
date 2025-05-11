const express = require("express");
require("dotenv").config();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const githubRoutes = require("./routes/githubRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GitHub Repo Remover Backend Running");
});

app.use("/", githubRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
