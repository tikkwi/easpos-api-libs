import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import process from 'node:process';

const getKey = async (password: string) =>
   (await promisify(scrypt)(password, 'salt', 32)) as Buffer;

export const encrypt = async (data: string, pwd?: string) => {
   const iv = randomBytes(20);
   const cipher = createCipheriv('aes-256-gcm', await getKey(pwd ?? process.env['ENC_PWD']), iv);
   return Buffer.from(
      JSON.stringify({
         iv,
         encrypted: Buffer.concat([cipher.update(data), cipher.final()]),
      }),
   ).toString('base64');
};

export const decrypt = async <T>(encrypted: string, pwd?: string) => {
   const { iv, encrypted: data } = JSON.parse(Buffer.from(encrypted, 'base64').toString());
   const decipher = createCipheriv(
      'aes-256-gcm',
      await getKey(pwd ?? process.env['ENC_PWD']),
      Buffer.from(iv),
   );
   const res = Buffer.concat([decipher.update(Buffer.from(data)), decipher.final()]).toString();
   try {
      return JSON.parse(res) as T;
   } catch (e) {
      return res as T;
   }
};
