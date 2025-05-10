const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
// cors
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 5000;
let accessTokenCache = {};
app.get("/", (req, res) => {
  res.send("GitHub Repo Remover Backend Running");
});
// step 1 : github authentication
app.get("/auth/github", (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo delete_repo`;
  res.redirect(redirectUrl);
});

// step 2 : github authentication callback
const axios = require("axios");

app.get("/auth/github/callback", async (req, res) => {
  const code = req.query.code;


  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenRes.data.access_token;
    accessTokenCache = { token: accessToken };
  

    // For now, return the token to test in Thunder Client
    res.redirect(`http://localhost:5173/success?token=${accessToken}`);

    // res.json({ accessToken });
  } catch (error) {
    console.error(
      "Error getting token:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to get access token" });
  }
});
// step 3 : get user repos
app.get("/repos", async (req, res) => {
  const accessToken =
    req.headers.authorization?.split(" ")[1] || accessTokenCache.token;


  if (!accessToken) {
    return res.status(401).json({ error: "Access token missing" });
  }

  try {
    // Call GitHub API to get repos
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      params: {
        per_page: 100, // max allowed per request
        page: 1, // loop through pages if needed
      },
    });
    
    // Send repos list as response
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching repos:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
});

// step 4 : delete repo
app.delete("/delete-repo", async (req, res) => {
  const accessToken =
    req.headers.authorization?.split(" ")[1] || accessTokenCache.token;
  
  const { fullRepoName } = req?.body;
  // const fullRepoName = "Rakibulislam-emon/new-project";

  if (!accessToken) {
    return res.status(401).json({ error: "Access token missing" });
  }

  if (!fullRepoName) {
    return res
      .status(400)
      .json({ error: "Repository name is required (format: username/repo)" });
  }

  try {
    const deleteResponse = await axios.delete(
      `https://api.github.com/repos/${fullRepoName}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    res.json({
      message: `✅ Repository ${fullRepoName} deleted successfully.`,
    });
  } catch (error) {
    console.error(
      "Error deleting repo:",
      error.response?.data || error.message
    );
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Something went wrong";
    res.status(status).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
