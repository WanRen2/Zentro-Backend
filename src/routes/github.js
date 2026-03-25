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
    const { chat_id, fingerprint, encrypted_key, chat_key } = req.body;
    if (!chat_id || !fingerprint) {
      return res.status(400).json({ error: 'chat_id and fingerprint required' });
    }
    // Store key for this fingerprint
    const path = `keys/${chat_id}/${fingerprint}.json`;
    const keyData = { encrypted_key, fingerprint };
    await uploadFile(path, JSON.stringify(keyData), `key:${chat_id}/${fingerprint}`);
    
    // If this is a shared chat_key (unencrypted for sharing), store it separately
    if (chat_key) {
      const sharedPath = `keys/${chat_id}/shared.json`;
      await uploadFile(sharedPath, JSON.stringify({ chat_key, updated_by: fingerprint }), `shared_key:${chat_id}`);
    }
    
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
    const participants = files
      .filter((f) => f.name !== 'shared.json' && f.name.endsWith('.json'))
      .map((f) => f.name.replace('.json', ''));
    res.json({ participants });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get shared chat key (for joining users)
githubRouter.get('/key/shared', async (req, res) => {
  try {
    const { chat_id } = req.query;
    if (!chat_id) return res.status(400).json({ error: 'chat_id required' });
    const content = await getFile(`keys/${chat_id}/shared.json`);
    if (!content) return res.status(404).json({ error: 'no shared key found' });
    res.json(JSON.parse(content));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
