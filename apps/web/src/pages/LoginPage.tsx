import { FC, useEffect, useState } from 'react';
import { useBodyClass, useTitle } from '@posad/react-core/hooks';
import { Input } from '@posad/react-core/components/input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { Button } from '@posad/react-core/components/button';
import {
  loginWithCredentials,
  authenticateWithGoogle,
  LoginFormValues,
  loginFormSchema,
} from 'libs/business-logic/src/features/auth';

import googleIcon from '../assets/icons/google.svg';

const LoginPage: FC = () => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginFormSchema),
    mode: 'onChange',
  });

  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Prompt the form to validate itself
   * immediately after the page is loaded.
   */
  useEffect(() => {
    trigger();
  }, [trigger]);

  useTitle('Login | Posad');
  useBodyClass('bg-slate-50');

  const handleError = (err: unknown) => {
    if (err instanceof Error) setErrorMessage(err.message);
    else setErrorMessage('An unknown error occured! Please try again.');
  };

  const handleFormSubmit = (values: LoginFormValues) => {
    setErrorMessage(null);
    setLoading(true);

    loginWithCredentials(values)
      .catch((err) => handleError(err))
      .finally(() => setLoading(false));
  };

  const handleGoogleAuthentication = () => {
    setErrorMessage(null);
    setLoading(true);

    authenticateWithGoogle()
      .catch((err) => handleError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <h1 className="text-3xl font-semibold text-center mt-12">posad</h1>
      <div className="flex justify-center items-center px-6 mt-6 mb-12">
        <div className="flex flex-col w-full max-w-[478px] bg-white border border-slate-100 shadow-md shadow-slate-200/50 px-6 pt-4 pb-8">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <h2 className="text-2xl font-medium text-center mb-8">
              Welcome Back!
            </h2>

            <fieldset className="flex flex-col gap-6" disabled={isLoading}>
              <div>
                <label htmlFor="email" className="mb-1">
                  Email Address
                </label>

                <Input
                  type="email"
                  inputMode="email"
                  aria-required="true"
                  {...register('email')}
                />
              </div>

              <div>
                <label className="mb-1" htmlFor="password">
                  Password
                </label>

                <Input
                  type="password"
                  aria-required="true"
                  {...register('password')}
                />
              </div>
            </fieldset>

            <Button
              type="submit"
              variant="filled"
              className="mt-4 w-full"
              disabled={!isValid}
              isLoading={isLoading}
            >
              Login
            </Button>

            <div className="text-red-500 mt-2">{errorMessage}</div>
          </form>

          <div className="flex items-center mt-6 -mx-1.5">
            <div className="h-px bg-slate-300 flex-1"></div>
            <div className="px-2 flex-1 text-center text-slate-500 leading-6">
              or login with
            </div>
            <div className="h-px bg-slate-300 flex-1"></div>
          </div>

          <div className="flex flex-col mt-6">
            <Button
              variant="outlined"
              onClick={() => handleGoogleAuthentication()}
            >
              <img
                src={googleIcon}
                alt=""
                width="24"
                height="24"
                className="absolute left-4"
              />

              <div>Google</div>
            </Button>
          </div>

          <div className="mt-6">
            <span className="text-gray-500">Don't have an account yet? </span>
            <Link to="/auth/register">Make one now!</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
