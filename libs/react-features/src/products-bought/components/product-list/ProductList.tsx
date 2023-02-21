import { IconButton } from '@posad/react-core/components/icon-button';
import { IconPlus } from '@tabler/icons-react';
import { FC } from 'react';
import ProductItem from './ProductItem';

const ProductList: FC = () => {
  return (
    <>
      <ul className="mt-8 flex flex-col gap-6">
        {Array.from({ length: 4 }, () => (
          <ProductItem />
        ))}
      </ul>

      <IconButton
        className="!justify-start mt-6"
        icon={IconPlus}
        label="Add Product"
        showLabel
      />
    </>
  );
};

export default ProductList;
