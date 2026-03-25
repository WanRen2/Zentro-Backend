# Zentro Backend Setup

## Quick Setup

### 1. Create Zentro-Messages Repository
- Go to GitHub.com
- Create new **private** repository: `Zentro-Messages`
- (Already done if you created it)

### 2. Setup GitHub Actions (Zentro-Backend repo)

Go to your **Zentro-Backend** repository on GitHub:

**Step A: Add Variables**
1. Go to Settings → Variables → Actions
2. Add these variables:

| Name | Value |
|------|-------|
| `BACKEND_PORT` | `3000` |
| `MESSAGES_REPO` | `WanRen2/Zentro-Messages` |

**Step B: Add Secrets**
1. Go to Settings → Secrets → Actions  
2. You need a PAT (Personal Access Token) with access to `Zentro-Messages`

**How to create PAT:**
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Click "Generate new token"
3. Name: `Zentro Actions`
4. Repository access: Select specific repositories → choose `Zentro-Messages`
5. Permissions: Repository → Contents (read/write)
6. Generate and copy the token

6. Add the token as secret:
   - Name: `ZENTRO_TOKEN`
   - Value: paste your new PAT

### 3. You're Done!
- Push to `Zentro-Backend` main branch
- GitHub Actions will auto-deploy
- Check the Actions tab for status

## Local Development

```bash
# Clone
git clone git@github.com:WanRen2/Zentro-Backend.git
cd Zentro-Backend

# Install
npm install

# Create .env file
cat > .env << EOF
PORT=3000
GITHUB_TOKEN=your_pat_here
GITHUB_OWNER=WanRen2
GITHUB_REPO=Zentro-Messages
DEV_BYPASS_AUTH=true
EOF

# Run
npm start
```

## API Endpoints

```
GET  /health           - Health check
POST /message/upload   - Upload encrypted message
GET  /message/list     - List messages in chat
GET  /message/get      - Get specific message
POST /chat/key/upload - Upload chat key
GET  /chat/key/get    - Get chat key
GET  /chat/keys/list  - List chat participants
```

## Security

- Client never sees GitHub token
- Backend only stores encrypted ciphertext
- Messages are E2E encrypted by the app
