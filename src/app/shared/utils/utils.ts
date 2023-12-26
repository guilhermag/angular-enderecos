export const deepClone = <T>(objeto: T): T => {
  return JSON.parse(JSON.stringify(objeto));
};
