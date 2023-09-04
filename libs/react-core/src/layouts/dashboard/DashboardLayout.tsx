import clsx from 'clsx';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import AppDrawer from './components/AppDrawer';
import AppMobileHeader from './components/AppMobileHeader';

export type DashboardLayoutProps = PropsWithChildren & {
  className?: string;
};

const desktopDrawerWidth = 260;

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, className }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const handleWindowResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (window === undefined) return;

    handleWindowResize();

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    document.body.classList.add('bg-gray-100');
  }, []);

  return (
    <div className={clsx('flex', isMobile && 'flex-col')}>
      {isMobile ? <AppMobileHeader onMenuOpen={handleOpenDrawer} /> : null}

      <AppDrawer
        isMobile={isMobile}
        isOpen={isDrawerOpen}
        desktopWidth={desktopDrawerWidth}
        onClose={handleCloseDrawer}
        className="z-10 fixed inset-y-0 bg-white"
      />

      <div
        className={clsx(
          'col-span-4 rounded-l-3xl p-4 max-w-full flex-1',
          className
        )}
        style={{
          paddingLeft: isMobile
            ? undefined
            : `calc(${desktopDrawerWidth}px + 1rem)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
