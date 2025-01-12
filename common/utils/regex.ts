import { camelCase } from 'lodash';

export const regex = {
   firstUpperCase: /^([a-z])/,
   userName: /^[a-zA-Z0-9]{3,12}$/,
   fieldName: /^[a-zA-Z0-9]{3,20}$/,
   enum: /^[a-zA-Z0-9]{1,12}$/,
};
// export const parsePath = (path: string) => /^\/([^/]+)\/([^/]+)(\/.*)?/g.exec(path).slice(1, 4);
//
export const firstUpperCase = (str: string) =>
   str.replace(regex.firstUpperCase, (_, letter) => letter.toUpperCase());
export const parseGrpcPath = (path: string) => /\/(.+)\.(.+)\/(.+)/g.exec(path).slice(1, 4);
export const getServiceToken = (model: string) => `${firstUpperCase(camelCase(model))}Service`;
export const transformToRpcMethod = (mth: string) => firstUpperCase(mth.replace(/(^[a-z]+_)/, ''));
