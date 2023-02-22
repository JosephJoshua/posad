import { IconButton } from '@posad/react-core/components/icon-button';
import { IconPlus } from '@tabler/icons-react';
import { ExpiringProduct } from '@posad/react-core/types';
import { FC, useEffect, useState } from 'react';
import AddProductForm from './AddProductForm';
import ProductItem from './ProductItem';
import { onSnapshot } from 'firebase/firestore';
import { collections, useAuthContext } from '@posad/react-core/libs/firebase';

const ProductList: FC = () => {
  const { firebaseUser } = useAuthContext();

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
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

  return (
    <>
      <ul className="mt-8 flex flex-col gap-6">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
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
          <AddProductForm onClose={() => setShowAddForm(false)} />
        )}
      </div>
    </>
  );
};

export default ProductList;
