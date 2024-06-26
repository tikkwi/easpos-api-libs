export const regex = {
  firstUpperCase: /^([a-z])/,
  parsePath: /^\/([^/]+)\/([^/]+)(\/.*)?/g,
  userName: /^[a-zA-Z0-9]{3,12}$/,
  enum: /^[a-zA-Z0-9]{1,12}$/,
};

export const firstUpperCase = (str: string) =>
  str.replace(regex.firstUpperCase, (_, letter) => letter.toUpperCase());

export const parsePath = (path: string) => {
  const pth = /^\/([^/]+)\/([^/]+)(\/.*)?/g.exec(path);
  return pth.slice(1, 3);
};
