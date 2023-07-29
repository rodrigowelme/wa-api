import { toNumber } from '@whiskeysockets/baileys';
import Long from 'long';

export function transformPrisma(objeto: any) {
  const obj = { ...objeto } as any;

  for (const [chave, val] of Object.entries(obj)) {
    if (val instanceof Uint8Array) {
      obj[chave] = Buffer.from(val);
    } else if (typeof val === 'number' || val instanceof Long) {
      obj[chave] = toNumber(val);
    } else if (val === undefined || val === null) {
      delete obj[chave];
    } else if (typeof val === 'object') {
      obj[chave] = { ...transformPrisma(obj[chave]) };
    }
  }

  return obj;
}

export function serializeData(objeto: any) {
  const obj = { ...objeto } as any;

  for (const [key, val] of Object.entries(obj)) {
    if (val instanceof Buffer) {
      obj[key] = val.toJSON();
    } else if (typeof val === 'bigint' || val instanceof BigInt) {
      obj[key] = val.toString();
    } else if (typeof val === 'undefined' || val === null) {
      delete obj[key];
    }
  }

  return obj;
}
