import { AuthenticationCreds, BaileysEventEmitter, BaileysEventMap, SignalDataTypeMap, SocketConfig, WASocket } from '@whiskeysockets/baileys';
import { Response } from 'express';

export type BaileysEventHandler<T extends keyof BaileysEventMap> = (args: BaileysEventMap[T]) => void;

export interface SessionProps extends WASocket {
  store: StoreProps;
  destroy: () => Promise<void>;
}

export declare class StoreProps {
  constructor(sessionId: string, event: BaileysEventEmitter);
}

export interface createSessionOptions {
  sessionId: string;
  res?: Response;
  SSE?: boolean;
  readIncomingMessages?: boolean;
  socketConfig?: SocketConfig;
}

export interface UseSessionProps {
  state: {
    creds: AuthenticationCreds;
    keys: {
      get: (
        type: keyof SignalDataTypeMap,
        ids: string[],
      ) => Promise<{
        [key: string]: any;
      }>;
      set: (data: any) => Promise<void>;
    };
  };
  saveCreds: () => Promise<void>;
}
