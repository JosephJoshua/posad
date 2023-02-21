import clsx from 'clsx';
import { FC, PropsWithChildren, useEffect } from 'react';
import AppDrawer from './components/AppDrawer';

export type DashboardLayoutProps = PropsWithChildren & {
  className?: string;
};

const drawerWidth = 260;

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, className }) => {
  useEffect(() => {
    document.body.classList.add('bg-gray-100');
  }, []);

  return (
    <div className="flex">
      <AppDrawer
        style={{ width: drawerWidth }}
        className="fixed inset-y-0 bg-white"
      />
      <div
        className={clsx(
          'col-span-4 rounded-l-3xl p-4 pb-8 max-w-full flex-1',
          className
        )}
        style={{ paddingLeft: `calc(${drawerWidth}px + 1rem)` }}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
