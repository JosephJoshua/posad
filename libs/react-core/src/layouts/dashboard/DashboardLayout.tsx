import { FC } from 'react';
import AppDrawer from './components/AppDrawer';

const DashboardLayout: FC = () => {
  return (
    <div className="grid grid-cols-5 h-screen">
      <AppDrawer />
      <div className="bg-gray-100 col-span-4 rounded-l-3xl"></div>
    </div>
  );
};

export default DashboardLayout;
