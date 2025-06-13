export const isEqual = (
  newData: Record<string, any>,
  data: Record<string, any>,
): boolean => {
  for (const item in newData) {
    if (newData.hasOwnProperty(item) && data.hasOwnProperty(item)) {
      if (newData[item] !== data[item]) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
};
