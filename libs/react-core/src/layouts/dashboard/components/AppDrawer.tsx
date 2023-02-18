import { FC } from 'react';
import { Icon, IconHome, IconBasket, IconLogout } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@posad/react-core/libs/firebase';

export type AppDrawerProps = {
  className?: string;
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
    to: '/shop',
    icon: IconBasket,
    title: 'Shop',
  },
]);

const AppDrawer: FC<AppDrawerProps> = ({ className }) => {
  return (
    <div className={clsx('flex flex-col px-4 pt-8 pb-4', className)}>
      <h1 className="text-3xl font-semibold text-center">posad</h1>

      <div className="flex-1 flex flex-col mt-16 gap-16">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-slate-100 w-20 h-20"></div>
          <div>User 1</div>
        </div>

        <div className="flex flex-col gap-2">
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

      <button
        className={clsx(
          'flex items-center gap-3',
          'px-4 py-3',
          'text-slate-600 rounded-md cursor-pointer',
          'transition duration-200',
          'hover:text-white hover:bg-primary-blue'
        )}
        type="button"
        onClick={() => signOut(auth)}
      >
        <IconLogout size={24} className="text-current" />
        <div className="text-current">Logout</div>
      </button>
    </div>
  );
};

export default AppDrawer;
