import { FC, useEffect } from 'react';
import { DashboardLayout } from '@posad/react-core/layouts/dashboard';
import { ProductList } from '@posad/react-features/products-bought';

const ProductsBoughtPage: FC = () => {
  useEffect(() => {
    document.title = 'Products Bought | Posad';
  }, []);

  return (
    <DashboardLayout className="flex flex-col">
      <div className="bg-white p-5 rounded-2xl flex flex-col">
        <h2 className="text-2xl font-medium">Products Bought</h2>
        <ProductList />
      </div>
    </DashboardLayout>
  );
};

export default ProductsBoughtPage;
