import { addSSE } from '@/controllers/wa/session';
import { Router } from 'express';

const waRouter = Router();

waRouter.get('/:sessionId/add-sse', addSSE);

export default waRouter;
