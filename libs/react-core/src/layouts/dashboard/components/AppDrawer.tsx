import { CSSProperties, FC } from 'react';
import { Icon, IconHome, IconLogout, IconFridge } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@posad/business-logic/libs/firebase';
import { Button } from '../../../components/button';
import { useAuthContext } from '@posad/react-core/libs/firebase';

export type AppDrawerProps = {
  className?: string;
  style?: CSSProperties;
};

type DrawerItem = {
  to: string;
  icon: Icon;
  title: string;
};

const drawerItems: readonly DrawerItem[] = Object.freeze([
  {
    to: '/',
    icon: IconHome,
    title: 'Home',
  },
  {
    to: '/products-bought',
    icon: IconFridge,
    title: 'Products Bought',
  },
]);

const AppDrawer: FC<AppDrawerProps> = ({ className, style }) => {
  const { userData } = useAuthContext();

  return (
    <div
      className={clsx('flex flex-col px-4 pt-8 pb-4', className)}
      style={style}
    >
      <h1 className="text-3xl font-semibold text-center">posad</h1>

      <div className="flex-1 flex flex-col mt-16 gap-16">
        <div className="flex flex-col items-center gap-2">
          <img
            className="rounded-full w-20 h-20 select-none"
            src="https://api.dicebear.com/5.x/bottts/svg"
          />

          <div>{userData?.name}</div>
        </div>

        <div className="flex flex-col gap-2 -mr-4 pr-4 overflow-y-scroll">
          {drawerItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title + item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'flex gap-3 items-center',
                    'p-3',
                    'rounded-md cursor-pointer',
                    'transition duration-200',
                    isActive
                      ? 'hover:bg-primary-blue/90'
                      : 'hover:bg-primary-blue/5',
                    isActive && 'bg-primary-blue text-white'
                  )
                }
              >
                <Icon size={24} />
                <div>{item.title}</div>
              </NavLink>
            );
          })}
        </div>
      </div>

      <Button
        variant="ghost"
        className="gap-3 !justify-start"
        onClick={() => signOut(auth)}
      >
        <IconLogout size={24} className="text-current" />
        <div className="text-current">Logout</div>
      </Button>
    </div>
  );
};

export default AppDrawer;
