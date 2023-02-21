import { Icon } from '@tabler/icons-react';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { Button, ButtonProps } from '../button';

export type IconButtonProps = ButtonProps & {
  icon: Icon;
  label: string;
  showLabel?: boolean;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, showLabel, className, ...props }, ref) => {
    const IconComponent = icon;

    return (
      <Button
        {...props}
        className={clsx('gap-3 !p-0', className)}
        aria-label={!showLabel ? label : undefined}
        ref={ref}
      >
        <IconComponent
          size={36}
          className={clsx(
            'transition duration-200 rounded-full p-2',
            'group-hover:bg-primary-blue group-hover:text-white'
          )}
        />

        {showLabel && (
          <span
            className={clsx(
              'text-slate-500',
              'transition duration-200',
              'group-hover:text-primary-blue'
            )}
          >
            {label}
          </span>
        )}
      </Button>
    );
  }
);

export default IconButton;
