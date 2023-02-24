import { FC, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useResizeObserver from '@react-hook/resize-observer';
import ProductCard from './ProductCard';
import { listenToExpiringProductsByExpirationDateAsc } from '@posad/business-logic/features/home';
import { useAuthContext } from '@posad/react-core/libs/firebase';
import { ExpiringProduct } from '@posad/business-logic/types';
import { IconMoodSad } from '@tabler/icons-react';

const ExpiringSoonContainer: FC = () => {
  const { firebaseUser } = useAuthContext();

  const [products, setProducts] = useState<ExpiringProduct[]>([]);
  const [isContainerOverflowing, setContainerOverflowing] =
    useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (firebaseUser == null) return;

    const unsubscribe = listenToExpiringProductsByExpirationDateAsc(
      firebaseUser.uid,
      setProducts
    );

    return () => unsubscribe();
  }, [firebaseUser]);

  const checkContainerOverflow = (el: Element) => {
    setContainerOverflowing(el.scrollWidth > el.clientWidth);
  };

  useResizeObserver(containerRef, (entry) =>
    checkContainerOverflow(entry.target)
  );

  const isEmpty = products.length === 0;

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
        {isEmpty && (
          <div className="my-6 w-full flex flex-col items-center gap-2">
            <IconMoodSad size={40} />
            <span className="text-lg">No products yet :(</span>
          </div>
        )}

        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ExpiringSoonContainer;
