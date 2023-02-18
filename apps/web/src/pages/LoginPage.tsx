import { FC, FormEvent, useEffect } from 'react';
import { Input } from '@posad/react-core/components/input';
import googleIcon from '../assets/icons/google.svg';
import clsx from 'clsx';

const LoginPage: FC = () => {
  useEffect(() => {
    document.body.classList.add('bg-slate-50');
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <h1 className="text-3xl font-semibold text-center mt-12">posad</h1>
      <div className="flex justify-center items-center mt-6">
        <div className="flex flex-col w-[478px] bg-white border border-slate-100 shadow-md shadow-slate-200/50 px-6 pt-4 pb-8">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-medium text-center mb-8">
              Welcome Back!
            </h2>

            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor="email" className="mb-1">
                  Email Address
                </label>

                <Input
                  type="email"
                  inputMode="email"
                  name="email"
                  aria-required="true"
                />
              </div>

              <div>
                <label className="mb-1" htmlFor="password">
                  Password
                </label>

                <Input type="password" name="password" aria-required="true" />
              </div>
            </div>

            <button
              type="submit"
              className={clsx(
                'mt-4 w-full bg-primary-blue text-white py-2.5 rounded-md',
                'transition duratino-200',
                'hover:bg-primary-blue/80'
              )}
            >
              Login
            </button>
          </form>

          <div className="flex items-center mt-6 -mx-1.5">
            <div className="h-px bg-slate-300 flex-1"></div>
            <div className="flex-1 text-center text-slate-500">
              or login with
            </div>
            <div className="h-px bg-slate-300 flex-1"></div>
          </div>

          <div className="flex flex-col mt-6">
            <button
              type="button"
              className={clsx(
                'relative py-2.5',
                'border-slate-300 border rounded-md',
                'transition duration-200',
                'hover:bg-gray-100'
              )}
            >
              <img
                src={googleIcon}
                alt=""
                width="24"
                height="24"
                className="absolute left-4"
              />

              <div>Google</div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
