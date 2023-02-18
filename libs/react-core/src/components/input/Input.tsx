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
          'focus-visible:border-primary-blue focus-visible:ring-0',
          className
        )}
        ref={ref}
      />
    );
  }
);

export default Input;
