import clsx from 'clsx';
import { InputHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';

export type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        {...props}
        className={clsx(
          'w-full py-2 rounded-md outline-transparent  border-slate-300',
          'transition duration-200',
          'enabled:focus-visible:border-primary-blue enabled:focus-visible:ring-0',
          'disabled:bg-gray-50 disabled:cursor-not-allowed',
          className
        )}
        ref={ref}
      />
    );
  }
);

export default Input;
