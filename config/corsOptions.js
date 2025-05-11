const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://github-repo-remover.vercel.app",
  ],
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;
