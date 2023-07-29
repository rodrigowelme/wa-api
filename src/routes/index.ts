import { Router } from 'express';
import waRouter from './wa/sessions';

const routes = Router();

routes.use('/wa', waRouter);

export default routes;
