import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOL_DEFINITIONS } from './tools/registry.js';
import { runReActAgent } from './agent/reactLoop.js';
import { listOutputFiles, readReportFile } from './tools/fileTools.js';
import { processConversationalAgentMessage } from './agent/chatAgent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Conversational Chat Agent Endpoint (ChatGPT-style + Autonomous Web & Real Actions)
app.post('/api/agent/chat', async (req, res) => {
  const { message, history, config } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const result = await processConversationalAgentMessage({
      message,
      history: history || [],
      config: config || {}
    });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ReAct AI Agent Server',
    timestamp: new Date().toISOString(),
    toolsCount: TOOL_DEFINITIONS.length
  });
});

// List available tools
app.get('/api/tools', (req, res) => {
  res.json({
    success: true,
    tools: TOOL_DEFINITIONS
  });
});

// List generated artifacts
app.get('/api/artifacts', async (req, res) => {
  const result = await listOutputFiles();
  res.json(result);
});

// Read artifact content
app.get('/api/artifacts/:filename', async (req, res) => {
  const { filename } = req.params;
  const result = await readReportFile(filename);
  if (result.success) {
    res.json(result);
  } else {
    res.status(404).json(result);
  }
});

// Synchronous agent run
app.post('/api/agent/run-sync', async (req, res) => {
  const { goal, maxSteps, config } = req.body;

  if (!goal) {
    return res.status(400).json({ error: 'Goal is required.' });
  }

  const events = [];
  const result = await runReActAgent({
    goal,
    maxSteps: maxSteps || 8,
    config: config || {},
    onEvent: (event) => events.push(event)
  });

  res.json({ ...result, events });
});

// Server-Sent Events (SSE) Agent Streaming Endpoint
app.get('/api/agent/stream', async (req, res) => {
  const goal = req.query.goal;
  const maxSteps = parseInt(req.query.maxSteps || '8', 10);
  const provider = req.query.provider || 'builtin';
  const apiKey = req.query.apiKey || '';
  const model = req.query.model || '';

  if (!goal) {
    return res.status(400).send('Goal parameter is required');
  }

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const sendEvent = (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  const abortController = new AbortController();
  req.on('close', () => {
    abortController.abort();
  });

  try {
    await runReActAgent({
      goal,
      maxSteps,
      config: { provider, apiKey, model },
      onEvent: sendEvent,
      abortSignal: abortController.signal
    });
  } catch (err) {
    sendEvent({ type: 'agent_error', data: { error: err.message } });
  } finally {
    res.write(`data: ${JSON.stringify({ type: 'stream_end' })}\n\n`);
    res.end();
  }
});

// Serve client in production if built
const clientDist = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 ReAct AI Agent Server running at http://localhost:${PORT} and http://0.0.0.0:${PORT}`);
  console.log(`⚡ Autonomous Tools Loaded: ${TOOL_DEFINITIONS.map(t => t.name).join(', ')}\n`);
});
