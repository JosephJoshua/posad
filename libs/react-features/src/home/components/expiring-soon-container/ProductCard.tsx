import { getProductImageUrl } from '@posad/business-logic/features/products-bought';
import { ExpiringProduct } from '@posad/business-logic/types';
import { IconClock } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';

export type ProductCardProps = {
  product: ExpiringProduct;
};

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (product.imageSource === 'user') {
      getProductImageUrl(product.imageUrl).then(setImageUrl);
      return;
    }

    setImageUrl(product.imageUrl);
  }, [product.imageSource, product.imageUrl]);

  return (
    <div className="flex flex-col gap-3 font-medium">
      <img
        className="w-[260px] h-[192px] object-contain bg-gray-100 rounded-2xl"
        src={imageUrl ?? undefined}
        alt=""
      />

      <div className="flex justify-between px-1">
        <span>{product.name}</span>
        <div className="flex items-center gap-2">
          <IconClock />
          <span>{dayjs(product.expirationDate.toDate()).fromNow()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
