export const generateUUID = (): string => {
  let dateData = new Date().getUTCDate();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (c: string) => {
      const randomData = (dateData + Math.random() * 16) % 16 | 0;
      dateData = Math.floor(dateData / 16);
      return (c === "x" ? randomData : (randomData & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};
