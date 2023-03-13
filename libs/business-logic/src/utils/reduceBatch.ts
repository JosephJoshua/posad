const reduceBatch = <ReturnValue, ElementType>(
  batchSize: number,
  arr: ElementType[],
  callback: (acc: ReturnValue, current: ElementType[]) => ReturnValue,
  initialValue: ReturnValue
): ReturnValue => {
  type ReduceResult = [ElementType[][], ReturnValue];

  const result = arr.reduce<ReduceResult>(
    (acc, curr, idx) => {
      const [group, value] = acc;

      let last = group[group.length - 1];
      const shouldAddBatch = last === undefined || last.length >= batchSize;

      if (shouldAddBatch) {
        group.push((last = [curr]));
      } else {
        last.push(curr);
      }

      if ((idx === arr.length - 1 || shouldAddBatch) && last?.length > 0) {
        return [group, callback(value, last)];
      }

      return acc;
    },
    [[], initialValue]
  );

  return result[1];
};

export default reduceBatch;
