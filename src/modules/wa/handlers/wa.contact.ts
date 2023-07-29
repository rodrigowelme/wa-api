import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BaileysEventEmitter } from '@whiskeysockets/baileys';
import { BaileysEventHandler } from '../wa.type';
import { logger, prisma } from '@/shared';
import { transformPrisma } from '../wa.format';

export default function contactHandler(sessionId: string, event: BaileysEventEmitter) {
  let listening = false;
  const set: BaileysEventHandler<'messaging-history.set'> = async ({ contacts }) => {
    try {
      const contactIds = contacts.map((c) => c.id);
      const deletedOldContactIds = (
        await prisma.contact.findMany({
          select: { id: true },
          where: { id: { notIn: contactIds }, sessionId },
        })
      ).map((c) => c.id);

      const upsertPromises = contacts
        .map((c) => transformPrisma(c))
        .map((data) =>
          prisma.contact.upsert({
            select: { pkId: true },
            create: { ...data, sessionId },
            update: data,
            where: { sessionId_id: { id: data.id, sessionId } },
          }),
        );

      await Promise.all([
        ...upsertPromises,
        prisma.contact.deleteMany({
          where: { id: { in: deletedOldContactIds }, sessionId },
        }),
      ]);
      logger.info(
        {
          deletedContacts: deletedOldContactIds.length,
          newContacts: contacts.length,
        },
        `wa.contact-messaging-history.set, contatos sincronizados, sessão: ${sessionId}.`,
      );
    } catch (err) {
      logger.error(`wa.contact-messaging-history.set, sessão: ${sessionId}.\n ${err}`);
    }
  };

  const upsert: BaileysEventHandler<'contacts.upsert'> = async (contacts) => {
    try {
      await Promise.all(
        contacts
          .map((c) => transformPrisma(c))
          .map((data) =>
            prisma.contact.upsert({
              select: { pkId: true },
              create: { ...data, sessionId },
              update: data,
              where: { sessionId_id: { id: data.id, sessionId } },
            }),
          ),
      );
    } catch (e) {
      logger.error(`wa.contact-contacts.upsert, sessão: ${sessionId}.`);
    }
  };

  const update: BaileysEventHandler<'contacts.update'> = async (updates) => {
    for (const update of updates) {
      try {
        await prisma.contact.upsert({
          select: { pkId: true },
          create: { ...transformPrisma(update), sessionId },
          update: transformPrisma(update),
          where: { sessionId_id: { id: update.id!, sessionId } },
        });
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
          return logger.info(`wa.contact-contacts.update, recebi atualização para contato não existente, sessão: ${sessionId}.\n`);
        }
        logger.error(`wa.contact-contacts.update, sessão: ${sessionId}.\n ${err}`);
      }
    }
  };

  const listen = () => {
    if (listening) return;

    event.on('messaging-history.set', set);
    event.on('contacts.upsert', upsert);
    event.on('contacts.update', update);
    listening = true;
  };

  const unlisten = () => {
    if (!listening) return;

    event.off('messaging-history.set', set);
    event.off('contacts.upsert', upsert);
    event.off('contacts.update', update);
    listening = false;
  };

  return { listen, unlisten };
}
