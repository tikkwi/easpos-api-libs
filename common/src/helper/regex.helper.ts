export const regex = {
  firstUpperCase: /^([a-z])/,
  parsePath: /^\/([^/]+)\/([^/]+)(\/.*)?/g,
  userName: /^[a-zA-Z0-9]{3,9}$/,
  enum: /^[a-zA-Z0-9]{1,12}$/,
};

export const firstUpperCase = (str: string) =>
  str.replace(regex.firstUpperCase, (_, letter) => letter.toUpperCase());

export const parsePath = (path: string) => regex.parsePath.exec(path).slice(1, 4);
