import { createSession, getSession, listSessions, name, sessionExists } from '@/modules/wa/wa.init';
import { logger } from '@/shared';
import { RequestHandler } from 'express';

export const addSSE: RequestHandler = async (req, res) => {
  const { sessionId } = req.params;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  logger.info(await name(sessionId));

  if (sessionExists(sessionId)) {
    res.write(`data: ${JSON.stringify({ error: 'Session already exists' })}\n\n`);
    res.end();
    return;
  }

  createSession({ sessionId, res, SSE: true });
};
