
const axios = require("axios");
const { getAccessToken } = require("../utils/githubAuth");
require("dotenv").config({
  path:
    process.env.NODE_ENV === "production" ? ".env.production" : ".env.local",
});

let accessTokenCache = {};

exports.githubAuth = (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo delete_repo`;
  res.redirect(redirectUrl);
};

exports.githubCallback = async (req, res) => {
  const code = req.query.code;
  try {
    const token = await getAccessToken(code);
    accessTokenCache.token = token;
    // Use environment variable for client URL instead of hardcoded localhost
    const clientURL = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientURL}/success?token=${token}`);
  } catch (err) {
    console.error("GitHub Token Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get access token" });
  }
};

exports.getRepos = async (req, res) => {
  const accessToken =
    req.headers.authorization?.split(" ")[1] || accessTokenCache.token;
  if (!accessToken)
    return res.status(401).json({ error: "Access token missing" });

  try {
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      params: { per_page: 100, page: 1 },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Repo Fetch Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
};

exports.deleteRepo = async (req, res) => {
  const accessToken =
    req.headers.authorization?.split(" ")[1] || accessTokenCache.token;
  const { fullRepoName } = req.body;

  if (!accessToken)
    return res.status(401).json({ error: "Access token missing" });
  if (!fullRepoName)
    return res.status(400).json({ error: "Repository name is required" });

  try {
    await axios.delete(`https://api.github.com/repos/${fullRepoName}`, {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    res.json({
      message: `✅ Repository ${fullRepoName} deleted successfully.`,
    });
  } catch (err) {
    console.error("Delete Repo Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || "Something went wrong";
    res.status(status).json({ error: message });
  }
};

// New endpoint for batch deletion
exports.batchDeleteRepos = async (req, res) => {
  const accessToken =
    req.headers.authorization?.split(" ")[1] || accessTokenCache.token;
  const { repoNames } = req.body;

  if (!accessToken)
    return res.status(401).json({ error: "Access token missing" });
  if (!repoNames || !Array.isArray(repoNames) || repoNames.length === 0) {
    return res
      .status(400)
      .json({ error: "Repository names array is required" });
  }

  const results = {
    successful: [],
    failed: [],
  };

  // Process deletions sequentially to avoid rate limiting issues
  for (const repoName of repoNames) {
    try {
      await axios.delete(`https://api.github.com/repos/${repoName}`, {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });
      results.successful.push(repoName);
    } catch (err) {
      console.error(
        `Error deleting ${repoName}:`,
        err.response?.data || err.message
      );
      results.failed.push({
        repoName,
        error: err.response?.data?.message || "Failed to delete",
      });
    }
  }

  res.json({
    message: `Deleted ${results.successful.length} of ${repoNames.length} repositories`,
    results,
  });
};
