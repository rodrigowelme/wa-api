import { logger, prisma } from '@/shared';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthenticationCreds, BufferJSON, SignalDataTypeMap, initAuthCreds, proto } from '@whiskeysockets/baileys';
import { UseSessionProps } from './wa.type';

export async function useSession(sessionId: string): Promise<UseSessionProps> {
  const fixId = (id: string) => id.replace(/\//g, '__')?.replace(/:/g, '-');

  const write = async (data: any, id: string) => {
    data = JSON.stringify(data, BufferJSON.replacer);
    id = fixId(id);
    try {
      await prisma.session.upsert({
        select: { pkId: true },
        create: { data, id, sessionId },
        update: { data },
        where: { sessionId_id: { id, sessionId } },
      });
    } catch (err) {
      logger.error(`Falha ao salvar sessão: ${sessionId}.\n ${err}`);
    }
  };

  const read = async (id: string) => {
    try {
      const { data } = await prisma.session.findUniqueOrThrow({
        select: { data: true },
        where: { sessionId_id: { id: fixId(id), sessionId } },
      });
      return JSON.parse(data, BufferJSON.reviver);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
        logger.info(`Sessão: ${sessionId} não autenticada.`);
      } else {
        logger.error(`Não existe sessão salva, sessão: ${sessionId}.\n ${err}`);
      }
      return null;
    }
  };

  const del = async (id: string) => {
    await prisma.session
      .delete({
        select: { pkId: true },
        where: { sessionId_id: { id: fixId(id), sessionId } },
      })
      .catch((err) => {
        logger.error(`Ocorreu um erro durante a exclusão da sessão, sessão: ${sessionId}.\n`, err);
      });
  };

  const creds: AuthenticationCreds = (await read('creds')) || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type: keyof SignalDataTypeMap, ids: string[]) => {
          const data: { [key: string]: SignalDataTypeMap[typeof type] } = {};
          await Promise.all(
            ids.map(async (id) => {
              let value = await read(`${type}-${id}`);
              if (type === 'app-state-sync-key' && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              data[id] = value;
            }),
          );

          return data;
        },
        set: async (data: any) => {
          const tasks: Promise<void>[] = [];

          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id];
              const sId = `${category}-${id}`;
              tasks.push(value ? write(value, sId) : del(sId));
            }
          }
          await Promise.all(tasks);
        },
      },
    },
    saveCreds: () => write(creds, 'creds'),
  };
}
