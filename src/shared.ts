import { PrismaClient } from '@prisma/client';
import pino from 'pino';

export const prisma = new PrismaClient();
export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  level: process.env.LOG_LEVEL || 'info',
});
