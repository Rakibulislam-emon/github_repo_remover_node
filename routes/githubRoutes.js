const express = require("express");
const router = express.Router();
const {
  githubAuth,
  githubCallback,
  getRepos,
  deleteRepo,
  batchDeleteRepos,
} = require("../controllers/githubController");

router.get("/auth/github", githubAuth);
router.get("/auth/github/callback", githubCallback);
router.get("/repos", getRepos);
router.delete("/delete-repo", deleteRepo);
router.delete("/batch-delete-repos", batchDeleteRepos);

module.exports = router;
