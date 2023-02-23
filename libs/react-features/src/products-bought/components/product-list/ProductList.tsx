import { IconButton } from '@posad/react-core/components/icon-button';
import { IconMoodSad, IconPlus } from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';
import ProductEntryForm from './ProductEntryForm';
import ProductItem from './ProductItem';
import { SimpleDialog } from '@posad/react-core/components/simple-dialog';
import { Button } from '@posad/react-core/components/button';
import { useAuthContext } from '@posad/react-core/libs/firebase';
import { ExpiringProduct } from '@posad/business-logic/types';
import {
  deleteProduct,
  listenToProductsInSection,
} from '@posad/business-logic/features/products-bought';

const ProductList: FC = () => {
  const { firebaseUser } = useAuthContext();

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);

  const [productToEdit, setProductToEdit] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] =
    useState<ExpiringProduct | null>(null);

  const [products, setProducts] = useState<ExpiringProduct[]>([]);

  useEffect(() => {
    if (firebaseUser == null) return;

    const unsubscribe = listenToProductsInSection(
      firebaseUser.uid,
      'default',
      setProducts
    );

    return () => unsubscribe();
  }, [firebaseUser]);

  const closeDeleteConfirmation = () => setProductToDelete(null);

  const handleDelete = async () => {
    if (firebaseUser == null || productToDelete == null) return;

    setDeleting(true);

    await deleteProduct(firebaseUser.uid, {
      sectionId: productToDelete.sectionId,
      productId: productToDelete.id,
    }).finally(() => setDeleting(false));

    closeDeleteConfirmation();
  };

  const isEmpty = products.length === 0;

  return (
    <>
      {isEmpty && (
        <div className="mt-12 flex flex-col items-center gap-2">
          <IconMoodSad size={40} />
          <span className="text-lg">No products yet :(</span>
        </div>
      )}

      {!isEmpty && (
        <ul className="mt-8 flex flex-col gap-6">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onEdit={() => setProductToEdit(product.id)}
              onDelete={() => setProductToDelete(product)}
              onEditStop={() => setProductToEdit(null)}
              isEditing={productToEdit === product.id}
            />
          ))}
        </ul>
      )}

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
          <ProductEntryForm
            action="add"
            /**
             * TODO: change
             */
            productIdentifier={{ sectionId: 'default' }}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </div>

      <SimpleDialog
        isOpen={productToDelete != null}
        onClose={closeDeleteConfirmation}
        title="Delete product"
        actions={
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="filled-ghost"
              size="sm"
              onClick={() => closeDeleteConfirmation()}
            >
              Cancel
            </Button>

            <Button
              variant="filled"
              size="sm"
              isLoading={isDeleting}
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
          </div>
        }
      >
        Are you sure you want to delete this product?
      </SimpleDialog>
    </>
  );
};

export default ProductList;
