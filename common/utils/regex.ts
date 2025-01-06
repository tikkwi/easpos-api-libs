import { camelCase, capitalize } from 'lodash';

export const regex = {
   userName: /^[a-zA-Z0-9]{3,12}$/,
   fieldName: /^[a-zA-Z0-9]{3,20}$/,
   enum: /^[a-zA-Z0-9]{1,12}$/,
};

// export const parsePath = (path: string) => /^\/([^/]+)\/([^/]+)(\/.*)?/g.exec(path).slice(1, 4);
//
export const parseGrpcPath = (path: string) => /\/(.+)\.(.+)\/(.+)/g.exec(path).slice(1, 4);
export const getServiceToken = (model: string) => `${capitalize(camelCase(model))}Service`;
export const transformToRpcMethod = (mth: string) => capitalize(mth.replace(/(^[a-z]+_)/, ''));
