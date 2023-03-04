import { IconButton } from '@posad/react-core/components/icon-button';
import { IconClock, IconEdit, IconTrash } from '@tabler/icons-react';
import { FC, useEffect, useRef, useState } from 'react';
import { ExpiringProduct } from '@posad/business-logic/types';
import dayjs from 'dayjs';
import {
  completeProduct,
  getProductImageUrl,
  isProductExpired,
} from '@posad/business-logic/features/products-bought';
import { useAuthContext } from '@posad/react-core/libs/firebase';
import ProductEntryForm from './ProductEntryForm';
import clsx from 'clsx';
import { AnimatePresence, m } from 'framer-motion';

export type ProductItemProps = {
  isEditing?: boolean;
  product: ExpiringProduct;
  onEdit: () => void;
  onDelete: () => void;
  onEditStop: () => void;
};

const ProductItem: FC<ProductItemProps> = ({
  isEditing,
  product,
  onEdit,
  onDelete,
  onEditStop,
}) => {
  const { firebaseUser } = useAuthContext();
  const isCompletingProduct = useRef<boolean>(false);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [isDone, setDone] = useState<boolean>(false);

  /**
   * We're using a state variable and updating it everytime
   * the props change to avoid having side effects in `useMemo`.
   */
  useEffect(() => {
    if (firebaseUser == null) return;

    if (product.imageSource === 'user') {
      getProductImageUrl(product.imageUrl).then(setImageUrl);
      return;
    }

    setImageUrl(product.imageUrl);
  }, [product.imageSource, product.imageUrl, firebaseUser]);

  useEffect(() => {
    if (firebaseUser == null) return;

    if (isDone && !isCompletingProduct.current) {
      isCompletingProduct.current = true;

      completeProduct(firebaseUser.uid, {
        productId: product.id,
        sectionId: product.sectionId,
      }).finally(() => (isCompletingProduct.current = false));
    }
  }, [isDone, firebaseUser, product]);

  return (
    <AnimatePresence mode="wait">
      {!isEditing && (
        <m.div
          className="flex border-b border-b-gray-200 pb-3 gap-4 justify-between items-center cursor-pointer"
          key="product-item"
          initial="hidden"
          animate="shown"
          exit="hidden"
          variants={{
            hidden: {
              opacity: 0,
              transition: {
                duration: 0.05,
              },
            },
            shown: {
              opacity: 1,
              transition: {
                duration: 0.15,
              },
            },
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="bg-white rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                <input
                  type="checkbox"
                  className={clsx(
                    'focus:opacity-100 focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue focus:outline-none',
                    'checked:border-none',
                    'appearance-none',
                    'transition duration-200',
                    'border rounded-full border-gray-400 absolute cursor-pointer w-full h-full text-primary-blue'
                  )}
                  checked={isDone}
                  onChange={(event) => setDone(event.target.checked)}
                />
              </div>
            </div>

            <img
              className="select-none w-[56px] h-[56px] bg-slate-100 rounded-full object-cover"
              src={imageUrl}
              alt=""
            />

            <div className="flex flex-col">
              <div className="text-lg">{product.name}</div>
              <div
                className={clsx(
                  'flex items-center gap-2',
                  isProductExpired(product) ? 'text-red-500' : 'text-slate-600'
                )}
              >
                <IconClock size={18} />
                <span>
                  {isProductExpired(product)
                    ? 'Expired :('
                    : dayjs(product.expirationDate.toDate()).fromNow()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <IconButton icon={IconEdit} label="Edit" onClick={() => onEdit()} />
            <IconButton
              icon={IconTrash}
              label="Delete"
              onClick={() => onDelete()}
            />
          </div>
        </m.div>
      )}

      {isEditing && (
        <m.div
          key="edit-form"
          initial="hidden"
          animate="shown"
          exit="hidden"
          variants={{
            hidden: {
              opacity: 0,
              height: 70,
            },
            shown: {
              opacity: 1,
              height: 'auto',
            },
          }}
        >
          <ProductEntryForm
            action="edit"
            onClose={() => onEditStop()}
            productIdentifier={product}
            initialValues={{
              name: product.name,
              expirationDate: product.expirationDate.toDate(),
              image: {
                path: product.imageUrl,
                source: product.imageSource,
                url: imageUrl,
                originalFileName: product.imageUrl.split('/').pop(),
              },
            }}
          />
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default ProductItem;
