import { createSession, deleteSession, getSession, getSessionStatus, listSessions, sessionExists } from '@/modules/wa/wa.init';
import { logger } from '@/shared';
import { RequestHandler } from 'express';

export const list: RequestHandler = (req, res) => {
  res.status(200).json(listSessions());
};

export const find: RequestHandler = (req, res) => res.status(200).json({ message: 'Session found' });

export const status: RequestHandler = (req, res) => {
  const session = getSession(req.params.sessionId)!;
  res.status(200).json({ status: getSessionStatus(session) });
};

export const add: RequestHandler = async (req, res) => {
  console.log(req.body);
  const { sessionId, readIncomingMessages, ...socketConfig } = req.body;

  if (sessionExists(sessionId)) return res.status(400).json({ error: 'Session already exists' });
  createSession({ sessionId, res, readIncomingMessages, socketConfig });
};

export const addSSE: RequestHandler = async (req, res) => {
  const { sessionId } = req.params;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  if (sessionExists(sessionId)) {
    res.write(`data: ${JSON.stringify({ error: 'Session already exists' })}\n\n`);
    res.end();
    return;
  }
  createSession({ sessionId, res, SSE: true });
};

export const del: RequestHandler = async (req, res) => {
  await deleteSession(req.params.sessionId);
  res.status(200).json({ message: 'Session deleted' });
};
