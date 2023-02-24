import { Disclosure } from '@headlessui/react';
import { SectionWithProducts } from '@posad/business-logic/features/products-bought';
import {
  ExpiringProduct,
  INITIAL_PRODUCT_SECTION,
} from '@posad/business-logic/types';
import { IconChevronUp, IconPlus } from '@tabler/icons-react';
import { FC } from 'react';
import ProductItem, { ProductItemProps } from './ProductItem';
import clsx from 'clsx';
import ProductEntryForm from './ProductEntryForm';
import { IconButton } from '@posad/react-core/components/icon-button';
import SectionEntryForm from './SectionEntryForm';

export type ProductSectionItemProps = {
  isAddingProduct: boolean;
  isAddingSection: boolean;
  onAddProductChange: (open: boolean) => void;
  onAddSectionChange: (open: boolean) => void;
  section: SectionWithProducts;
  itemProps: (product: ExpiringProduct) => Omit<ProductItemProps, 'product'>;
};

const ProductSectionItem: FC<ProductSectionItemProps> = ({
  section,
  itemProps,
  isAddingProduct,
  isAddingSection,
  onAddProductChange,
  onAddSectionChange,
}) => {
  const isEmpty = section.products.length === 0;

  const addProductForm = !isAddingProduct ? (
    <IconButton
      onClick={() => onAddProductChange(true)}
      className="!justify-start w-full"
      icon={IconPlus}
      label="Add product"
      showLabel
    />
  ) : (
    <ProductEntryForm
      action="add"
      productIdentifier={{ sectionId: section.id }}
      onClose={() => onAddProductChange(false)}
    />
  );

  const addSectionForm = !isAddingSection ? (
    <button
      className={clsx(
        'w-full opacity-0 cursor-pointer',
        'transition duration-300',
        'hover:opacity-100'
      )}
      type="button"
      onClick={() => onAddSectionChange(true)}
    >
      <div className="flex items-center gap-4 select-none">
        <div className="flex-1 h-px bg-primary-blue"></div>
        <div>Add section</div>
        <div className="flex-1 h-px bg-primary-blue"></div>
      </div>
    </button>
  ) : (
    <SectionEntryForm action="add" onClose={() => onAddSectionChange(false)} />
  );

  const products = (
    <>
      <ul className="flex flex-col gap-4">
        {section.products.map((product) => (
          <li key={product.id}>
            <ProductItem product={product} {...itemProps(product)} />
          </li>
        ))}
      </ul>

      <div className={clsx(!isEmpty && 'mt-6')}>{addProductForm}</div>
      <div className="mt-2">{addSectionForm}</div>
    </>
  );

  const disclosure = (
    <Disclosure as="div" className="flex flex-col gap-4">
      {({ open }) => (
        <>
          <Disclosure.Button className="flex items-center gap-3 border-b border-b-gray-200 pb-3">
            <IconChevronUp
              size={20}
              className={clsx(
                open && 'transform rotate-180',
                'transition duration-200',
                'text-gray-500'
              )}
            />

            <span className="font-medium">{section.name}</span>
          </Disclosure.Button>

          <Disclosure.Panel>{products}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );

  return section.id === INITIAL_PRODUCT_SECTION ? products : disclosure;
};

export default ProductSectionItem;
