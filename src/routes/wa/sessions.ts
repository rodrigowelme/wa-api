import { add, addSSE, del, find, list, status } from '@/controllers/wa/session';
import { sessionValidate } from '@/middlewares/session';
import { Router } from 'express';

const waRouter = Router();

waRouter.get('/', list);
waRouter.get('/:sessionId', sessionValidate, find);
waRouter.get('/:sessionId/status', sessionValidate, status);
waRouter.post('/add', add);
waRouter.get('/:sessionId/add-sse', addSSE);
waRouter.delete('/:sessionId', sessionValidate, del);

export default waRouter;
