import { Disclosure } from '@headlessui/react';
import { SectionWithProducts } from '@posad/business-logic/features/products-bought';
import {
  ExpiringProduct,
  INITIAL_PRODUCT_SECTION,
} from '@posad/business-logic/types';
import {
  IconChevronUp,
  IconEdit,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { m, MotionProps } from 'framer-motion';
import { FC, MouseEvent, useState } from 'react';
import ProductItem, { ProductItemProps } from './ProductItem';
import clsx from 'clsx';
import ProductEntryForm from './ProductEntryForm';
import { IconButton } from '@posad/react-core/components/icon-button';
import SectionEntryForm from './SectionEntryForm';
import { AnimatePresence } from 'framer-motion';

export type ProductSectionItemProps = {
  isAddingProduct: boolean;
  isAddingSection: boolean;
  onAddProductChange: (open: boolean) => void;
  onAddSectionChange: (open: boolean) => void;
  onDeleteSection: () => void;
  section: SectionWithProducts;
  itemProps: (product: ExpiringProduct) => Omit<ProductItemProps, 'product'>;
};

const opacityAnimationProps: Partial<MotionProps> = {
  initial: 'hidden',
  animate: 'shown',
  exit: 'hidden',
  variants: {
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
  },
};

const heightAnimationProps = (initialHeight: number): Partial<MotionProps> => ({
  initial: 'closed',
  animate: 'opened',
  exit: 'closed',
  variants: {
    opened: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.2,
      },
    },
    closed: {
      opacity: 0,
      height: initialHeight,
      transition: { opacity: { duration: 0.1 } },
    },
  },
});

const ProductSectionItem: FC<ProductSectionItemProps> = ({
  section,
  itemProps,
  isAddingProduct,
  isAddingSection,
  onAddProductChange,
  onAddSectionChange,
  onDeleteSection,
}) => {
  const [isEditing, setEditing] = useState<boolean>(false);

  const handleDisclosureAction = (fn: () => void) => {
    return (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      fn();
    };
  };

  const addProductForm = !isAddingProduct ? (
    <m.div key="add-product-btn" {...opacityAnimationProps}>
      <IconButton
        onClick={() => onAddProductChange(true)}
        className="!justify-start w-full"
        icon={IconPlus}
        label="Add product"
        showLabel
      />
    </m.div>
  ) : (
    <m.div key="add-product-form" {...heightAnimationProps(36)}>
      <ProductEntryForm
        action="add"
        productIdentifier={{ sectionId: section.id }}
        onClose={() => onAddProductChange(false)}
      />
    </m.div>
  );

  const addSectionForm = !isAddingSection ? (
    <m.button
      className={clsx(
        'w-full md:opacity-0 cursor-pointer text-gray-500 md:text-primary-blue',
        'transition duration-300',
        'hover:opacity-100'
      )}
      key="add-section-button"
      type="button"
      onClick={() => onAddSectionChange(true)}
    >
      <div className="flex items-center gap-4 select-none">
        <div className="flex-1 h-px bg-primary-blue/60 md:bg-primary-blue"></div>
        <div>Add section</div>
        <div className="flex-1 h-px bg-primary-blue/60 md:bg-primary-blue"></div>
      </div>
    </m.button>
  ) : (
    <m.div key="add-section-form" {...heightAnimationProps(24)}>
      <SectionEntryForm
        action="add"
        sectionBeforeId={section.id}
        onClose={() => onAddSectionChange(false)}
      />
    </m.div>
  );

  const products = (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="popLayout">
        {section.products.map((product) => (
          <m.div
            key={product.id}
            initial="hidden"
            animate="shown"
            exit="hidden"
            variants={{
              shown: {
                scale: 1,
                opacity: 1,
              },
              hidden: {
                scale: 0.8,
                opacity: 0,
              },
            }}
            className="mb-2"
          >
            <ProductItem product={product} {...itemProps(product)} />
          </m.div>
        ))}

        <div key="add-product" className="flex flex-col">
          <AnimatePresence mode="wait">{addProductForm}</AnimatePresence>
        </div>

        <div key="add-section" className="flex flex-col">
          <AnimatePresence mode="wait">{addSectionForm}</AnimatePresence>
        </div>
      </AnimatePresence>
    </div>
  );

  const disclosure = (
    <Disclosure as="div" className="flex flex-col gap-4">
      {({ open }) => (
        <>
          <Disclosure.Button
            as="div"
            className="flex justify-between items-center gap-3 border-b border-b-gray-200 pb-3"
          >
            <button className="flex flex-1 items-center gap-3" type="button">
              <IconChevronUp
                size={20}
                className={clsx(
                  open && 'transform rotate-180',
                  'transition duration-200',
                  'text-gray-500'
                )}
              />

              <span className="font-medium">{section.name}</span>
            </button>

            <div className="flex gap-2">
              <IconButton
                icon={IconEdit}
                label="Edit"
                onClick={handleDisclosureAction(() => setEditing(true))}
              />

              <IconButton
                icon={IconTrash}
                label="Delete"
                onClick={handleDisclosureAction(onDeleteSection)}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel static>
            <AnimatePresence>
              {open && (
                <m.div
                  key="content"
                  initial="closed"
                  animate="opened"
                  exit="closed"
                  transition={{}}
                  variants={{
                    opened: {
                      opacity: 1,
                      height: 'auto',
                      transition: {
                        height: { duration: 0.2 },
                        opacity: { duration: 0.25 },
                      },
                    },
                    closed: {
                      opacity: 0,
                      height: 0,
                      transition: {
                        height: { duration: 0.2 },
                        opacity: { duration: 0.1 },
                      },
                    },
                  }}
                >
                  {products}
                </m.div>
              )}
            </AnimatePresence>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );

  const sectionElement = (
    <AnimatePresence mode="wait">
      {!isEditing ? (
        <m.div key="disclosure" {...opacityAnimationProps}>
          {disclosure}
        </m.div>
      ) : (
        <m.div key="edit-form" {...heightAnimationProps(65)}>
          <SectionEntryForm
            action="edit"
            onClose={() => setEditing(false)}
            sectionId={section.id}
            initialValues={section}
          />
        </m.div>
      )}
    </AnimatePresence>
  );
  return section.id === INITIAL_PRODUCT_SECTION ? products : sectionElement;
};

export default ProductSectionItem;
