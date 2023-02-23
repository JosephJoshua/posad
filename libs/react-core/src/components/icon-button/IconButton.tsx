import { Icon } from '@tabler/icons-react';
import clsx from 'clsx';
import { forwardRef, isValidElement, ReactElement } from 'react';
import { Button, ButtonProps } from '../button';

export type IconButtonProps = ButtonProps & {
  icon: Icon | ReactElement;
  iconPosition?: 'left' | 'right';
  label: string;
  showLabel?: boolean;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon, label, showLabel, className, iconPosition = 'left', ...props },
    ref
  ) => {
    const IconComponent = icon;

    return (
      <Button
        {...props}
        className={clsx('gap-3', props.variant == null && '!p-0', className)}
        aria-label={!showLabel ? label : undefined}
        ref={ref}
      >
        {showLabel && (
          <span
            className={clsx(
              'text-slate-500',
              'transition duration-200',
              'group-hover:text-primary-blue',
              iconPosition === 'left' ? 'order-2' : 'order-1'
            )}
          >
            {label}
          </span>
        )}

        <div className={iconPosition === 'left' ? 'order-1' : 'order-2'}>
          {isValidElement(IconComponent) ? (
            IconComponent
          ) : (
            <IconComponent
              size={36}
              className={clsx(
                'transition duration-200 rounded-full p-2',
                'group-hover:bg-primary-blue group-hover:text-white'
              )}
            />
          )}
        </div>
      </Button>
    );
  }
);

export default IconButton;
