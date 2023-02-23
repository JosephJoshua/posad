import { FC, useEffect, useState } from 'react';
import { useBodyClass, useTitle } from '@posad/react-core/hooks';
import { Input } from '@posad/react-core/components/input';
import { Button } from '@posad/react-core/components/button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  authenticateWithGoogle,
  registerFormSchema,
  RegisterFormValues,
  registerWithCredentials,
} from '@posad/business-logic/features/auth';
import { Link } from 'react-router-dom';

import googleIcon from '../assets/icons/google.svg';

const RegisterPage: FC = () => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, dirtyFields, isValid },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerFormSchema),
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

  useTitle('Register | Posad');
  useBodyClass('bg-slate-50');

  const handleError = (err: unknown) => {
    if (err instanceof Error) setErrorMessage(err.message);
    else setErrorMessage('An unknown error occured! Please try again.');
  };

  const handleFormSubmit = (values: RegisterFormValues) => {
    setErrorMessage(null);
    setLoading(true);

    registerWithCredentials(values)
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
            <h2 className="text-2xl font-medium text-center mb-8">Welcome!</h2>

            <fieldset className="flex flex-col gap-6" disabled={isLoading}>
              <div>
                <label htmlFor="email" className="mb-1">
                  Name
                </label>

                <Input type="text" aria-required="true" {...register('name')} />
              </div>

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

                {errors.password != null && dirtyFields.password && (
                  <div className="text-red-500 mt-2">
                    {errors.password?.message}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1" htmlFor="password">
                  Confirm Password
                </label>

                <Input
                  type="password"
                  aria-required="true"
                  {...register('passwordConfirmation')}
                />

                {errors.passwordConfirmation != null &&
                  dirtyFields.passwordConfirmation && (
                    <div className="text-red-500 mt-2">
                      {errors.passwordConfirmation?.message}
                    </div>
                  )}
              </div>
            </fieldset>

            <Button
              type="submit"
              variant="filled"
              className="mt-4 w-full"
              disabled={!isValid}
              isLoading={isLoading}
            >
              Register
            </Button>

            <div className="text-red-500 mt-2">{errorMessage}</div>
          </form>

          <div className="flex items-center mt-6 -mx-1.5 gap-2">
            <div className="h-px bg-slate-300 flex-1"></div>
            <div className="flex-1 text-center text-slate-500 leading-5">
              or register with
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
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/auth/login">Login now!</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
