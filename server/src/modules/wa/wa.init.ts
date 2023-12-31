import { Boom } from '@hapi/boom';
import makeWASocket, { Browsers, ConnectionState, DisconnectReason, delay, isJidBroadcast, makeCacheableSignalKeyStore, proto } from '@whiskeysockets/baileys';
import { toDataURL } from 'qrcode';
import { Store } from './wa.store';
import { SessionProps, createSessionOptions } from './wa.type';
import { logger, prisma } from '@/shared';
import { useSession } from './wa.session';
import { pino } from 'pino';

const sessions = new Map<string, SessionProps>();
const retries = new Map<string, number>();
const SSEQRGenerations = new Map<string, number>();

const RECONNECT_INTERVAL = Number(process.env.RECONNECT_INTERVAL || 0);
const MAX_RECONNECT_RETRIES = Number(process.env.MAX_RECONNECT_RETRIES || 5);
const SSE_MAX_QR_GENERATION = Number(process.env.SSE_MAX_QR_GENERATION || 5);
const SESSION_CONFIG_ID = 'session-config';

export async function name(id: string) {
  return SSEQRGenerations.get(id);
}

export async function init() {
  const sessions = await prisma.session.findMany({
    select: { sessionId: true, data: true },
    where: { id: { startsWith: SESSION_CONFIG_ID } },
  });

  for (const { sessionId, data } of sessions) {
    const { readIncomingMessages, ...socketConfig } = JSON.parse(data);
    createSession({ sessionId, readIncomingMessages, socketConfig });
  }
}

function shouldReconnect(sessionId: string) {
  let attempts = retries.get(sessionId) ?? 0;

  if (attempts < MAX_RECONNECT_RETRIES) {
    attempts += 1;
    retries.set(sessionId, attempts);
    return true;
  }
  return false;
}

export async function createSession(options: createSessionOptions) {
  const { sessionId, res, SSE = false, readIncomingMessages = false, socketConfig } = options;
  const configID = `${SESSION_CONFIG_ID}-${sessionId}`;
  let connectionState: Partial<ConnectionState> = { connection: 'close' };

  const destroy = async (logout = true) => {
    try {
      await Promise.all([
        logout && socket.logout(),
        prisma.chat.deleteMany({ where: { sessionId } }),
        prisma.contact.deleteMany({ where: { sessionId } }),
        prisma.message.deleteMany({ where: { sessionId } }),
        prisma.group.deleteMany({ where: { sessionId } }),
        prisma.session.deleteMany({ where: { sessionId } }),
      ]);
    } catch (e) {
      logger.error('An error occured during session destroy');
    } finally {
      sessions.delete(sessionId);
    }
  };

  const handleConnectionClose = () => {
    const code = (connectionState.lastDisconnect?.error as Boom)?.output?.statusCode;
    const restartRequired = code === DisconnectReason.restartRequired;
    const doNotReconnect = !shouldReconnect(sessionId);

    if (code === DisconnectReason.loggedOut || doNotReconnect) {
      if (res) {
        !SSE && !res.headersSent && res.status(500).json({ error: 'Unable to create session' });
        res.end();
      }
      destroy(doNotReconnect);
      return;
    }

    if (!restartRequired) {
      logger.info(`${{ attempts: retries.get(sessionId) ?? 1, sessionId }} Reconnecting...`);
    }
    setTimeout(() => createSession(options), restartRequired ? 0 : RECONNECT_INTERVAL);
  };

  const handleNormalConnectionUpdate = async () => {
    if (connectionState.qr?.length) {
      if (res && !res.headersSent) {
        try {
          const qr = await toDataURL(connectionState.qr);
          res.status(200).json({ qr });
          return;
        } catch (e) {
          logger.error('An error occured during QR generation');
          res.status(500).json({ error: 'Unable to generate QR' });
        }
      }
      destroy();
    }
  };

  const handleSSEConnectionUpdate = async () => {
    let qr: string | undefined = undefined;
    if (connectionState.qr?.length) {
      try {
        qr = await toDataURL(connectionState.qr);
      } catch (e) {
        logger.error('An error occured during QR generation');
      }
    }

    const currentGenerations = SSEQRGenerations.get(sessionId) ?? 0;
    if (!res || res.writableEnded || (qr && currentGenerations >= SSE_MAX_QR_GENERATION)) {
      res && !res.writableEnded && res.end();
      destroy();
      return;
    }

    const data = { ...connectionState, qr };
    if (qr) SSEQRGenerations.set(sessionId, currentGenerations + 1);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const handleConnectionUpdate = SSE ? handleSSEConnectionUpdate : handleNormalConnectionUpdate;
  const { state, saveCreds } = await useSession(sessionId);
  const socket = makeWASocket({
    printQRInTerminal: false,
    browser: Browsers.ubuntu('Chrome'),
    generateHighQualityLinkPreview: true,
    ...socketConfig,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
    },
    logger: pino({ level: 'fatal' }),
    shouldIgnoreJid: (jid) => isJidBroadcast(jid),
    getMessage: async (key) => {
      const data = await prisma.message.findFirst({
        where: { remoteJid: key.remoteJid!, id: key.id!, sessionId },
      });
      return (data?.message || undefined) as proto.IMessage | undefined;
    },
  });

  const store = new Store(sessionId, socket.ev);
  sessions.set(sessionId, { ...socket, destroy, store });

  socket.ev.on('creds.update', saveCreds);
  socket.ev.on('connection.update', (update) => {
    connectionState = update;
    const { connection } = update;

    if (connection === 'open') {
      retries.delete(sessionId);
      SSEQRGenerations.delete(sessionId);
    }
    if (connection === 'close') handleConnectionClose();
    handleConnectionUpdate();
  });

  if (readIncomingMessages) {
    socket.ev.on('messages.upsert', async (m) => {
      const message = m.messages[0];
      if (message.key.fromMe || m.type !== 'notify') return;
      await delay(1000);
      await socket.readMessages([message.key]);
    });
  }

  await prisma.session.upsert({
    create: {
      id: configID,
      sessionId,
      data: JSON.stringify({ readIncomingMessages, ...socketConfig }),
    },
    update: {},
    where: { sessionId_id: { id: configID, sessionId } },
  });
}

export function getSessionStatus(session: SessionProps) {
  const { isOpen, isClosed, isClosing, isConnecting } = session.ws;
  const status = session.user ? 'CONNECTED' : isClosed ? 'DISCONNECTED' : isClosing ? 'DISCONNECTING' : isConnecting ? 'CONNECTING' : null;
  return status;
}

export function listSessions() {
  return Array.from(sessions.entries()).map(([id, session]) => ({
    id,
    status: getSessionStatus(session),
  }));
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId);
}

export async function deleteSession(sessionId: string) {
  sessions.get(sessionId)?.destroy();
}

export function sessionExists(sessionId: string) {
  return sessions.has(sessionId);
}

export async function jidExists(session: SessionProps, jid: string, type: 'group' | 'number' = 'number') {
  try {
    if (type === 'number') {
      const [result] = await session.onWhatsApp(jid);
      return !!result?.exists;
    }

    const groupMeta = await session.groupMetadata(jid);
    return !!groupMeta.id;
  } catch (e) {
    return Promise.reject(e);
  }
}
