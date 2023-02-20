import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';
import AppDrawer from './components/AppDrawer';

export type DashboardLayoutProps = PropsWithChildren & {
  className?: string;
};

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, className }) => {
  return (
    <div className="grid grid-cols-5 h-screen">
      <AppDrawer />
      <div
        className={clsx('bg-gray-100 col-span-4 rounded-l-3xl p-4', className)}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
