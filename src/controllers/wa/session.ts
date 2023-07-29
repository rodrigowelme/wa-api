import { createSession, getSession, listSessions, sessionExists } from '@/modules/wa/wa.init';
import { RequestHandler } from 'express';

export const addSSE: RequestHandler = async (req, res) => {
  const { sessionId } = req.params;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  listSessions();

  if (sessionExists(sessionId)) {
    res.write(`data: ${JSON.stringify({ error: 'Session already exists' })}\n\n`);
    res.end();
    return;
  }

  createSession({ sessionId, res, SSE: true });
};
