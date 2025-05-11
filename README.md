# GitHub Repo Remover - Server

A Node.js Express server that provides API endpoints for the GitHub Repo Remover application, handling GitHub OAuth authentication and repository management operations.

## Features

- **GitHub OAuth**: Secure authentication flow with GitHub
- **Repository Management**: Fetch, filter, and delete GitHub repositories
- **Batch Operations**: Efficiently handle multiple repository operations
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Configured for secure cross-origin requests

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **Axios**: Promise-based HTTP client for API requests
- **dotenv**: Environment variable management
- **CORS**: Cross-Origin Resource Sharing middleware

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- GitHub OAuth App credentials

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: GitHub Repo Remover
   - Homepage URL: http://localhost:5173
   - Authorization callback URL: http://localhost:5000/auth/github/callback
4. Register the application and note your Client ID and Client Secret

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/github-repo-remover.git
   cd github-repo-remover/server
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   PORT=5000
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
   CLIENT_URL=http://localhost:5173
   ```

4. Start the server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. The server will be running at `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/github` | Initiates GitHub OAuth flow |
| GET | `/auth/github/callback` | OAuth callback handler |
| GET | `/repos` | Fetches user's GitHub repositories |
| DELETE | `/delete-repo` | Deletes a single repository |
| DELETE | `/batch-delete-repos` | Deletes multiple repositories |

## Project Structure

```
server/
├── config/           # Configuration files
│   └── corsOptions.js # CORS configuration
├── controllers/      # Request handlers
│   └── githubController.js # GitHub API operations
├── routes/           # API routes
│   └── githubRoutes.js # Route definitions
├── utils/            # Utility functions
│   └── githubAuth.js # GitHub authentication helpers
├── .env              # Environment variables (not in repo)
├── .gitignore        # Git ignore file
├── index.js          # Entry point
└── package.json      # Dependencies and scripts
```

## Error Handling

The server implements comprehensive error handling:

- Authentication errors (401)
- Bad requests (400)
- Not found errors (404)
- GitHub API errors (various)
- Server errors (500)

All errors are logged to the console with detailed information and returned to the client with appropriate status codes.

## Security Considerations

- GitHub tokens are not stored in the database
- CORS is configured to only allow requests from the client application
- Sensitive information is stored in environment variables
- Input validation is performed on all endpoints

## Deployment

For production deployment:

1. Set up environment variables on your hosting platform
2. Update the GitHub OAuth callback URL to your production URL
3. Configure CORS for your production client URL
4. Deploy using your preferred hosting service (Heroku, Vercel, etc.)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [GitHub API Documentation](https://docs.github.com/en/rest) for the comprehensive API reference
- [Express.js](https://expressjs.com/) for the web framework
- [OAuth 2.0](https://oauth.net/2/) for the authentication protocol

