import { IconButton } from '@posad/react-core/components/icon-button';
import { IconMenu } from '@tabler/icons-react';
import { FC } from 'react';

export type AppMobileHeaderProps = {
  onMenuOpen?: () => void;
};

const AppMobileHeader: FC<AppMobileHeaderProps> = ({ onMenuOpen }) => {
  const handleOpenMenu = () => {
    onMenuOpen?.();
  };

  return (
    <div className="py-5 px-4 flex justify-between items-center sticky top-0  bg-white z-10 border-b">
      <div></div>

      <h1 className="text-3xl font-semibold text-center">posad</h1>

      <IconButton
        onClick={handleOpenMenu}
        icon={IconMenu}
        label="Open Menu"
        showLabel={false}
      />
    </div>
  );
};

export default AppMobileHeader;
