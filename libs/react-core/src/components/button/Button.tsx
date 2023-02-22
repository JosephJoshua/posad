import clsx from 'clsx';
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';

import { ReactComponent as DotsSpinner } from '../../../assets/spinners/dots.svg';

export type ButtonVariants = 'filled' | 'outlined' | 'ghost' | 'filled-ghost';

type ButtonAttributes = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export type ButtonProps = Omit<ButtonAttributes, 'value'> & {
  spinnerClassName?: string;
  isLoading?: boolean;
  variant?: ButtonVariants;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      isLoading,
      variant,
      className,
      children,
      spinnerClassName,
      type,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = clsx(
      'group relative px-4 py-2.5 rounded-md',
      'flex items-center justify-center',
      'transition duration-200',
      'disabled:cursor-not-allowed',
      !isLoading && 'disabled:bg-gray-200 disabled:text-gray-400'
    );

    const variantStyles: Record<ButtonVariants, string> = {
      filled: clsx(
        'bg-primary-blue text-white',
        'enabled:hover:bg-primary-blue/80'
      ),
      outlined: clsx('border border-slate-300', 'enabled:hover:bg-gray-100'),
      ghost: clsx('enabled:hover:text-white enabled:hover:bg-primary-blue'),
      'filled-ghost': clsx(
        'bg-gray-100 text-black',
        'enabled:hover:bg-gray-200'
      ),
    };

    const variantSpinnerStyles: Record<ButtonVariants, string> = {
      filled: clsx('text-white'),
      outlined: clsx('text-primary-blue'),
      ghost: clsx('text-white'),
      'filled-ghost': clsx('text-primary-blue'),
    };

    return (
      <button
        {...props}
        ref={ref}
        type={type ?? 'button'}
        disabled={disabled || isLoading}
        className={clsx(
          baseStyles,
          variant && variantStyles[variant],
          className
        )}
      >
        {isLoading ? (
          <DotsSpinner
            className={clsx(
              variant && variantSpinnerStyles[variant],
              spinnerClassName
            )}
          />
        ) : (
          children
        )}
      </button>
    );
  }
);

export default Button;
