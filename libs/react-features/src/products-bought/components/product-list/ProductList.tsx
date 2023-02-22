import { IconButton } from '@posad/react-core/components/icon-button';
import { IconMoodSad, IconPlus } from '@tabler/icons-react';
import { ExpiringProduct } from '@posad/react-core/types';
import { FC, useEffect, useState } from 'react';
import AddProductForm from './AddProductForm';
import ProductItem from './ProductItem';
import { deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { collections, useAuthContext } from '@posad/react-core/libs/firebase';
import { SimpleDialog } from 'libs/react-core/src/components/simple-dialog';
import { Button } from '@posad/react-core/components/button';

const ProductList: FC = () => {
  const { firebaseUser } = useAuthContext();

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] =
    useState<ExpiringProduct | null>(null);

  const [products, setProducts] = useState<ExpiringProduct[]>([]);

  useEffect(() => {
    if (firebaseUser == null) return;

    const unsubscribe = onSnapshot(
      collections.expiringProducts(firebaseUser.uid, 'default'),
      (snap) => {
        setProducts(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    );

    return () => unsubscribe();
  }, [firebaseUser]);

  const closeDeleteConfirmation = () => setProductToDelete(null);

  const handleDelete = async () => {
    if (firebaseUser == null || productToDelete == null) return;

    setDeleting(true);

    await deleteDoc(
      doc(
        collections.expiringProducts(
          firebaseUser.uid,
          productToDelete.sectionId
        ),
        productToDelete.id
      )
    ).finally(() => setDeleting(false));

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
              onDelete={() => setProductToDelete(product)}
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
          <AddProductForm onClose={() => setShowAddForm(false)} />
        )}
      </div>

      <SimpleDialog
        isOpen={productToDelete != null}
        onClose={closeDeleteConfirmation}
        title="Delete product"
        message="Are you sure you want to delete this product?"
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
      />
    </>
  );
};

export default ProductList;
