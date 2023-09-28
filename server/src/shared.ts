import { PrismaClient } from '@prisma/client';
import winston, { createLogger } from 'winston';

export const prisma = new PrismaClient();
export const logger = createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.label({ label: `Label🏷️` }),
    winston.format.timestamp({ format: 'DD-MMM-YYYY HH:mm:ss' }),
    winston.format.printf((info) => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`),
  ),
  transports: [new winston.transports.Console()],
});
