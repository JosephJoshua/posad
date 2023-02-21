import { IconClock } from '@tabler/icons-react';
import { FC, useRef, useState } from 'react';
import clsx from 'clsx';
import useResizeObserver from '@react-hook/resize-observer';
import ProductCard from './ProductCard';

const ExpiringSoonContainer: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContainerOverflowing, setContainerOverflowing] =
    useState<boolean>(false);

  const checkContainerOverflow = (el: Element) => {
    setContainerOverflowing(el.scrollWidth > el.clientWidth);
  };

  useResizeObserver(containerRef, (entry) =>
    checkContainerOverflow(entry.target)
  );

  return (
    <div className="bg-dark-gray text-white p-5 rounded-2xl">
      <h2 className="font-medium text-xl">Expiring soon</h2>
      <div
        className={clsx(
          'flex gap-6 mt-4 overflow-x-scroll scrollbar-thin scrollbar-track-dark-gray scrollbar-thumb-gray-100',
          isContainerOverflowing && 'pb-6'
        )}
        ref={containerRef}
      >
        {Array.from({ length: 4 }, (_, idx) => (
          <ProductCard key={idx} />
        ))}
      </div>
    </div>
  );
};

export default ExpiringSoonContainer;
