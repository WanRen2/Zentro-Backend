import { Router } from 'express';
import { uploadFile, getFile, listDir } from '../github.js';

export const githubRouter = Router();

// Message routes - mounted at /message
githubRouter.post('/upload', async (req, res) => {
  try {
    const { chat_id, message_id, payload } = req.body;
    if (!chat_id || !message_id || !payload) {
      return res.status(400).json({ error: 'chat_id, message_id and payload are required' });
    }
    const path = `chats/${chat_id}/${message_id}.json`;
    await uploadFile(path, JSON.stringify(payload), `msg:${chat_id}`);
    res.json({ status: 'ok' });
  } catch (e) {
    console.error('[message/upload] ', e.message);
    res.status(500).json({ error: e.message });
  }
});

githubRouter.get('/list', async (req, res) => {
  try {
    const { chat_id } = req.query;
    if (!chat_id) return res.status(400).json({ error: 'chat_id required' });
    const files = await listDir(`chats/${chat_id}`);
    const ids = files.filter((f) => f.name.endsWith('.json')).map((f) => f.name);
    res.json({ messages: ids.map((id) => ({ id })) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

githubRouter.get('/get', async (req, res) => {
  try {
    const { chat_id, message_id } = req.query;
    if (!chat_id || !message_id) return res.status(400).json({ error: 'chat_id and message_id required' });
    const content = await getFile(`chats/${chat_id}/${message_id}`);
    if (!content) return res.status(404).json({ error: 'not found' });
    res.json(JSON.parse(content));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Chat key routes - mounted at /chat
githubRouter.post('/key/upload', async (req, res) => {
  try {
    const { chat_id, fingerprint, encrypted_key } = req.body;
    if (!chat_id || !fingerprint || !encrypted_key) {
      return res.status(400).json({ error: 'chat_id, fingerprint, encrypted_key required' });
    }
    const path = `keys/${chat_id}/${fingerprint}.json`;
    await uploadFile(path, JSON.stringify({ encrypted_key }), `key:${chat_id}/${fingerprint}`);
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

githubRouter.get('/key/get', async (req, res) => {
  try {
    const { chat_id, fingerprint } = req.query;
    if (!chat_id || !fingerprint) {
      return res.status(400).json({ error: 'chat_id and fingerprint required' });
    }
    const content = await getFile(`keys/${chat_id}/${fingerprint}.json`);
    if (!content) return res.status(404).json({ error: 'not found' });
    res.json(JSON.parse(content));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

githubRouter.get('/keys/list', async (req, res) => {
  try {
    const { chat_id } = req.query;
    if (!chat_id) return res.status(400).json({ error: 'chat_id required' });
    const files = await listDir(`keys/${chat_id}`);
    res.json({ participants: files.map((f) => f.name.replace('.json', '')) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
