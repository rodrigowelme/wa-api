import { BaileysEventEmitter } from '@whiskeysockets/baileys';
import chatHandler from './handlers/wa.chat';
import messageHandler from './handlers/wa.message';
import contactHandler from './handlers/wa.contact';

export class Store {
  private readonly chatHandler;
  private readonly messageHandler;
  private readonly contactHandler;

  constructor(sessionId: string, event: BaileysEventEmitter) {
    this.chatHandler = chatHandler(sessionId, event);
    this.messageHandler = messageHandler(sessionId, event);
    this.contactHandler = contactHandler(sessionId, event);
    this.listen();
  }

  public listen() {
    this.chatHandler.listen();
    this.messageHandler.listen();
    this.contactHandler.listen();
  }

  public unlisten() {
    this.chatHandler.unlisten();
    this.messageHandler.unlisten();
    this.contactHandler.unlisten();
  }
}
