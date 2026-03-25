# Zentro Backend

Minimal Node.js server providing transport layer between Zentro Flutter app and GitHub storage for encrypted messages.

## Security

- PAT stored only in environment variable `GITHUB_TOKEN`
- Client never sees the GitHub token
- No decryption on backend - stores only ciphertext in GitHub repository
- Private repository access only for the backend server

## API Endpoints

### Messages
- `POST /message/upload` - Upload encrypted message
  ```json
  { "chat_id": "uuid", "message_id": "uuid", "payload": {...} }
  ```
- `GET /message/list?chat_id=...` - List messages in a chat
- `GET /message/get?chat_id=...&message_id=...` - Get specific message

### Chat Keys
- `POST /chat/key/upload` - Upload encrypted chat key for a user
  ```json
  { "chat_id": "uuid", "fingerprint": "sha256...", "encrypted_key": "base64" }
  ```
- `GET /chat/key/get?chat_id=...&fingerprint=...` - Get encrypted chat key
- `GET /chat/keys/list?chat_id=...` - List chat participants

### Health
- `GET /health` - Server health check

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```env
   PORT=3000
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
   GITHUB_OWNER=your-username
   GITHUB_REPO=Zentro-Messages
   DEV_BYPASS_AUTH=true  # Remove in production
   ```

3. Run:
   ```bash
   npm start
   ```

## GitHub Repository Structure

```
/chats
   /<chat_id>
       /<message_uuid>.json
/keys
   /<chat_id>
       /<fingerprint>.json
```

## Auto Cleanup

GitHub Actions workflow runs daily at 00:00 MSK (21:00 UTC) to delete all chats and keys.
