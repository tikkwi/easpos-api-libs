export const intersection = (a1: Array<string>, a2: Array<string>) => {
   const l1 = a1.length;
   const l2 = a2.length;
   const s = new Set((l1 > l2 ? a1 : a2).map((e) => e));
   const res = [];
   (l1 > l2 ? a2 : a1).forEach((e) => s.has(e) && res.push(e));
   return res;
};
