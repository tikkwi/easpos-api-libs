import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import process from 'node:process';

const getKey = (password: string): any => createHash('sha256').update(password).digest();

export const encrypt = (data: string, pwd?: string) => {
   const iv: any = randomBytes(16);
   const cipher = createCipheriv('aes-256-cbc', getKey(pwd ?? process.env['ENC_PWD']), iv);
   return `${iv.toString('hex')}:${cipher.update(data, 'utf-8', 'hex')}${cipher.final('hex')}`;
};

export const decrypt = <T>(encrypted: string, pwd?: string) => {
   const [iv, data] = encrypted.split(':');
   const decipher = createDecipheriv(
      'aes-256-cbc',
      getKey(pwd ?? process.env['ENC_PWD']),
      Buffer.from(iv, 'hex') as any,
   );
   const res = decipher.update(data, 'hex', 'utf-8') + decipher.final('utf-8');
   try {
      return JSON.parse(res) as T;
   } catch (e) {
      return res as T;
   }
};
