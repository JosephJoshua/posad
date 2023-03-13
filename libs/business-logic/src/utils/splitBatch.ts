import reduceBatch from './reduceBatch';

const splitBatch = <ElementType>(
  batchSize: number,
  arr: ElementType[]
): ElementType[][] => {
  return reduceBatch<ElementType[][], ElementType>(
    batchSize,
    arr,
    (acc, curr) => acc.concat(curr),
    []
  );
};

export default splitBatch;
