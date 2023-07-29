import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BaileysEventEmitter } from '@whiskeysockets/baileys';
import { BaileysEventHandler } from '../wa.type';
import { logger, prisma } from '@/shared';
import { transformPrisma } from '../wa.format';

export default function chatHandler(
  sessionId: string,
  event: BaileysEventEmitter,
) {
  let listening = false;

  const set: BaileysEventHandler<'messaging-history.set'> = async ({
    chats,
    isLatest,
  }) => {
    try {
      await prisma.$transaction(async (tx) => {
        if (isLatest) await tx.chat.deleteMany({ where: { sessionId } });

        const existingIds = (
          await tx.chat.findMany({
            select: { id: true },
            where: { id: { in: chats.map((c) => c.id) }, sessionId },
          })
        ).map((i) => i.id);
        const chatsAdded = (
          await tx.chat.createMany({
            data: chats
              .filter((c) => !existingIds.includes(c.id))
              .map((c) => ({ ...transformPrisma(c), sessionId })),
          })
        ).count;

        logger.info(
          `wa.chat-messaging-history.set sincronizados, sessão: ${sessionId}, ${chatsAdded}.`,
        );
      });
    } catch (err) {
      logger.error(
        `wa.chat-messaging-history.set sessão: ${sessionId}.\n ${err}`,
      );
    }
  };

  const upsert: BaileysEventHandler<'chats.upsert'> = async (chats) => {
    try {
      await Promise.all(
        chats
          .map((c) => transformPrisma(c))
          .map((data) =>
            prisma.chat.upsert({
              select: { pkId: true },
              create: { ...data, sessionId },
              update: data,
              where: { sessionId_id: { id: data.id, sessionId } },
            }),
          ),
      );
    } catch (err) {
      logger.error(`wa.chat-chats.upsert, sessão: ${sessionId}.\n ${err}`);
    }
  };

  const update: BaileysEventHandler<'chats.update'> = async (updates) => {
    for (const update of updates) {
      try {
        const data = transformPrisma(update);
        await prisma.chat.update({
          select: { pkId: true },
          data: {
            ...data,
            unreadCount:
              typeof data.unreadCount === 'number'
                ? data.unreadCount > 0
                  ? { increment: data.unreadCount }
                  : { set: data.unreadCount }
                : undefined,
          },
          where: { sessionId_id: { id: update.id!, sessionId } },
        });
      } catch (err) {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === 'P2025'
        ) {
          return logger.info(
            `wa.chat-chats.update: Recebi atualização para um bate-papo não existente, sessão: ${sessionId}. ${update}`,
          );
        }
        logger.error(
          `wa.chat-chats.update: Um erro ocorreu durante a atualização do chat, sessão: ${sessionId}.\n ${err}`,
        );
      }
    }
  };

  const del: BaileysEventHandler<'chats.delete'> = async (ids) => {
    try {
      await prisma.chat.deleteMany({
        where: { id: { in: ids } },
      });
    } catch (err) {
      logger.error(
        `wa.chat-chats.delete: Erro ao excluir chat ${sessionId}.\n ${err}`,
      );
    }
  };

  const listen = () => {
    if (listening) return;

    event.on('messaging-history.set', set);
    event.on('chats.upsert', upsert);
    event.on('chats.update', update);
    event.on('chats.delete', del);
    listening = true;
  };

  const unlisten = () => {
    if (!listening) return;

    event.off('messaging-history.set', set);
    event.off('chats.upsert', upsert);
    event.off('chats.update', update);
    event.off('chats.delete', del);
    listening = false;
  };

  return { listen, unlisten };
}
