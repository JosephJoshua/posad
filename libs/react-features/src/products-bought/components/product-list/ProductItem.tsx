import { IconButton } from '@posad/react-core/components/icon-button';
import { IconClock, IconEdit, IconTrash } from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';
import { ExpiringProduct } from '@posad/business-logic/types';
import dayjs from 'dayjs';
import { getProductImageUrl } from '@posad/business-logic/features/products-bought';
import { useAuthContext } from '@posad/react-core/libs/firebase';
import ProductEntryForm from './ProductEntryForm';
import clsx from 'clsx';

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
  const [imageUrl, setImageUrl] = useState<string>('');

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

  const isExpired = dayjs().isSameOrAfter(
    dayjs(product.expirationDate.toDate()),
    'day'
  );

  return (
    <div
      className={clsx(
        'flex border-b border-b-gray-200 pb-3 gap-4',
        isEditing
          ? 'flex-col items-stretch'
          : 'justify-between items-center cursor-pointer'
      )}
    >
      {!isEditing && (
        <>
          <div className="flex items-center gap-4">
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
                  isExpired ? 'text-red-500' : 'text-slate-600'
                )}
              >
                <IconClock size={18} />
                <span>
                  {isExpired
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
        </>
      )}

      {isEditing && (
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
      )}
    </div>
  );
};

export default ProductItem;
