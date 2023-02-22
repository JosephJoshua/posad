import { Button } from '@posad/react-core/components/button';
import { IconButton } from '@posad/react-core/components/icon-button';
import { Input } from '@posad/react-core/components/input';
import { IconCalendar, IconPlus } from '@tabler/icons-react';
import clsx from 'clsx';
import { FC, KeyboardEvent, useRef, useState } from 'react';
import ProductItem from './ProductItem';

const ProductList: FC = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const addFormRef = useRef<HTMLDivElement>(null);

  const handleAddFormKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();

      setShowAddForm(false);
    }
  };

  return (
    <>
      <ul className="mt-8 flex flex-col gap-6">
        {Array.from({ length: 4 }, () => (
          <ProductItem />
        ))}
      </ul>

      <div className="mt-6">
        {!showAddForm && (
          <IconButton
            onClick={() => setShowAddForm(true)}
            className="!justify-start"
            icon={IconPlus}
            label="Add Product"
            showLabel
          />
        )}

        {showAddForm && (
          <div
            className={clsx(
              'rounded-md border border-gray-200 pt-1 pb-2',
              'transition duration-200',
              'focus-within:border-gray-500'
            )}
            ref={addFormRef}
            onKeyUp={handleAddFormKeyDown}
          >
            <div className="px-2">
              <Input placeholder="Product name" className="pl-1" autoFocus />

              <IconButton
                className="!p-2 !gap-2 mt-2 text-sm"
                variant="outlined"
                icon={<IconCalendar size={20} />}
                label="Expiration date"
                showLabel
              />
            </div>

            <div className="h-px w-full bg-gray-200 mt-4"></div>

            <div className="flex justify-end mx-2 mt-2 gap-2">
              <Button
                variant="filled-ghost"
                className="text-sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>

              <Button variant="filled" className="text-sm">
                Add product
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
