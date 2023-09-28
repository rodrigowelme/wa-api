import { sessionExists } from '@/modules/wa/wa.init';
import type { RequestHandler } from 'express';

export const sessionValidate: RequestHandler = (req, res, next) => {
  if (!sessionExists(req.params.sessionId)) return res.status(404).json({ error: 'Session not found' });
  next();
};
