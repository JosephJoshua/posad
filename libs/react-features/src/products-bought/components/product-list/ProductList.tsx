import { IconMoodSad } from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';
import { SimpleDialog } from '@posad/react-core/components/simple-dialog';
import { Button } from '@posad/react-core/components/button';
import { useAuthContext } from '@posad/react-core/libs/firebase';
import { ExpiringProduct } from '@posad/business-logic/types';
import {
  deleteProduct,
  deleteSection,
  listenToAllProducts,
  SectionWithProducts,
} from '@posad/business-logic/features/products-bought';
import ProductSectionItem from './ProductSectionItem';
import { AnimatePresence, m } from 'framer-motion';

const ProductList: FC = () => {
  const { firebaseUser } = useAuthContext();

  const [isDeleting, setDeleting] = useState<boolean>(false);

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
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  const [productToEdit, setProductToEdit] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] =
    useState<ExpiringProduct | null>(null);

  const [data, setData] = useState<SectionWithProducts[]>([]);

  useEffect(() => {
    if (firebaseUser == null) return;

    const unsubscribes = listenToAllProducts(firebaseUser.uid, setData);
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [firebaseUser]);

  const closeProductDeleteConfirmation = () => setProductToDelete(null);
  const closeSectionDeleteConfirmation = () => setSectionToDelete(null);

  const handleDeleteProduct = async () => {
    if (firebaseUser == null || productToDelete == null) return;

    setDeleting(true);

    await deleteProduct(firebaseUser.uid, {
      sectionId: productToDelete.sectionId,
      productId: productToDelete.id,
    }).finally(() => setDeleting(false));

    closeProductDeleteConfirmation();
  };

  const handleDeleteSection = async () => {
    if (firebaseUser == null || sectionToDelete == null) return;

    setDeleting(true);

    await deleteSection(firebaseUser.uid, sectionToDelete).finally(() =>
      setDeleting(false)
    );

    closeSectionDeleteConfirmation();
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
          <AnimatePresence>
            {data.map((section) => (
              <m.li
                key={section.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                  transition: { delay: 0.25 },
                }}
                exit={{ opacity: 0, height: 0 }}
              >
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
                  onDeleteSection={() => setSectionToDelete(section.id)}
                  itemProps={(product) => ({
                    onEdit: () => setProductToEdit(product.id),
                    onDelete: () => setProductToDelete(product),
                    onEditStop: () => setProductToEdit(null),
                    isEditing: productToEdit === product.id,
                  })}
                />
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <SimpleDialog
        isOpen={sectionToDelete != null}
        onClose={closeSectionDeleteConfirmation}
        title="Delete section"
        actions={
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="filled-ghost"
              size="sm"
              onClick={() => closeSectionDeleteConfirmation()}
            >
              Cancel
            </Button>

            <Button
              variant="filled"
              size="sm"
              isLoading={isDeleting}
              onClick={() => handleDeleteSection()}
            >
              Delete
            </Button>
          </div>
        }
      >
        Are you sure you want to delete this section?
      </SimpleDialog>

      <SimpleDialog
        isOpen={productToDelete != null}
        onClose={closeProductDeleteConfirmation}
        title="Delete product"
        actions={
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="filled-ghost"
              size="sm"
              onClick={() => closeProductDeleteConfirmation()}
            >
              Cancel
            </Button>

            <Button
              variant="filled"
              size="sm"
              isLoading={isDeleting}
              onClick={() => handleDeleteProduct()}
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
