import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { githubRouter } from './routes/github.js';
import { auth } from './auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'zentro-backend' });
});

// Mount API routes at root - as per spec: /message/... /chat/key/...
// Auth middleware applies to all /message and /chat routes
app.use('/message', auth, githubRouter);
app.use('/chat', auth, githubRouter);

app.listen(PORT, () => {
  console.log(`[zentro] backend listening on :${PORT}`);
});
