import { IconMoodSad } from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';
import { SimpleDialog } from '@posad/react-core/components/simple-dialog';
import { Button } from '@posad/react-core/components/button';
import { useAuthContext } from '@posad/react-core/libs/firebase';
import { ExpiringProduct } from '@posad/business-logic/types';
import {
  deleteProduct,
  listenToAllProducts,
  SectionWithProducts,
} from '@posad/business-logic/features/products-bought';
import ProductSectionItem from './ProductSection';

const ProductList: FC = () => {
  const { firebaseUser } = useAuthContext();

  const [isDeletingProduct, setDeletingProduct] = useState<boolean>(false);

  /**
   * The id of the section that currently has the add product form shown.
   */
  const [sectionAddingProduct, setSectionAddingProduct] = useState<
    string | null
  >(null);

  /**
   * The id of the section that currently has the add section form shown.
   */
  const [sectionAdding, setSectionAdding] = useState<string | null>(null);

  const [productToEdit, setProductToEdit] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] =
    useState<ExpiringProduct | null>(null);

  const [data, setData] = useState<SectionWithProducts[]>([]);

  useEffect(() => {
    if (firebaseUser == null) return;

    const unsubscribes = listenToAllProducts(firebaseUser.uid, setData);
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [firebaseUser]);

  const closeDeleteConfirmation = () => setProductToDelete(null);

  const handleDelete = async () => {
    if (firebaseUser == null || productToDelete == null) return;

    setDeletingProduct(true);

    await deleteProduct(firebaseUser.uid, {
      sectionId: productToDelete.sectionId,
      productId: productToDelete.id,
    }).finally(() => setDeletingProduct(false));

    closeDeleteConfirmation();
  };

  const isEmpty = data.length === 0;

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
          {data.map((section) => (
            <li key={section.id}>
              <ProductSectionItem
                section={section}
                isAddingProduct={sectionAddingProduct === section.id}
                isAddingSection={sectionAdding === section.id}
                onAddProductChange={(val) =>
                  setSectionAddingProduct(val ? section.id : null)
                }
                onAddSectionChange={(val) =>
                  setSectionAdding(val ? section.id : null)
                }
                itemProps={(product) => ({
                  onEdit: () => setProductToEdit(product.id),
                  onDelete: () => setProductToDelete(product),
                  onEditStop: () => setProductToEdit(null),
                  isEditing: productToEdit === product.id,
                })}
              />
            </li>
          ))}
        </ul>
      )}

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
              isLoading={isDeletingProduct}
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
