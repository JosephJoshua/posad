import { IconButton } from '@posad/react-core/components/icon-button';
import { IconClock, IconEdit, IconTrash } from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';
import { ExpiringProduct } from '@posad/business-logic/types';
import dayjs from 'dayjs';
import { getProductImageUrl } from '@posad/business-logic/features/products-bought';
import { useAuthContext } from '@posad/react-core/libs/firebase';

export type ProductItemProps = {
  product: ExpiringProduct;
  onDelete: () => void;
};

const ProductItem: FC<ProductItemProps> = ({ product, onDelete }) => {
  const { firebaseUser } = useAuthContext();
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

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

  return (
    <li className="flex justify-between items-center border-b border-b-gray-200 pr-2 pb-3 gap-4 cursor-pointer">
      <div className="flex items-center gap-4">
        <img
          className="w-[56px] h-[56px] bg-slate-100 rounded-full object-cover"
          src={imageUrl}
          alt=""
        />

        <div className="flex flex-col">
          <div className="text-lg">{product.name}</div>
          <div className="flex items-center gap-2">
            <IconClock size={18} className="text-slate-600" />
            <span className="text-slate-600">
              {dayjs(product.expirationDate.toDate()).toNow(true)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <IconButton icon={IconEdit} label="Edit" />
        <IconButton
          icon={IconTrash}
          label="Delete"
          onClick={() => onDelete()}
        />
      </div>
    </li>
  );
};

export default ProductItem;
