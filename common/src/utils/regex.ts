export const regex = {
   firstUpperCase: /^([a-z])/,
   userName: /^[a-zA-Z0-9]{3,12}$/,
   enum: /^[a-zA-Z0-9]{1,12}$/,
};

export const firstUpperCase = (str: string) =>
   str.replace(regex.firstUpperCase, (_, letter) => letter.toUpperCase());

// export const parsePath = (path: string) => /^\/([^/]+)\/([^/]+)(\/.*)?/g.exec(path).slice(1, 4);
//
// export const parseGrpcPath = (path: string) => /\/(.+)\.(.+)\/(.+)/g.exec(path).slice(1, 4);
