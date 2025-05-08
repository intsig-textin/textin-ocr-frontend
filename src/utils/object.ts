export function ensureArray<T>(data: any) {
  return (Array.isArray(data) ? data : []) as T[];
}

export const sortList = (list: any[]) => {
  return list
    .map((item) => ({
      ...item,
      value: [null, undefined].includes(item.value) ? "" : String(item.value),
    }))
    .sort((a, b) => {
      if (a.value && !b.value) {
        return -1;
      } else if (!a.value && b.value) {
        return 1;
      }
      return 0;
    });
};

export const isBoolean = (value: any) => value === true || value === false;
