import { FC, useEffect, useState } from 'react';
import { Input } from '@posad/react-core/components/input';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  authenticateWithGoogle,
  registerWithCredentials,
} from '@posad/react-features/auth';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import { ReactComponent as DotsSpinner } from '../assets/spinners/dots.svg';
import googleIcon from '../assets/icons/google.svg';

const registerFormSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .test((val, ctx) => {
      const createError = (message: string) =>
        ctx.createError({
          path: ctx.path,
          message,
        });

      if (val == null || val.length < 8 || val.length > 32) {
        return createError(
          'Password must be betweeen 8 and 32 characters long.'
        );
      }

      if (!/^(?=.*[a-z])/.test(val)) {
        return createError(
          'Password must contain at least 1 lowercase character.'
        );
      }

      if (!/^(?=.*[A-Z])/.test(val)) {
        return createError(
          'Password must contain at least 1 uppercase character.'
        );
      }

      if (!/^(?=.*[0-9])/.test(val)) {
        return createError('Password must contain at least 1 digit.');
      }

      if (!/^(?=.*[!@#$%^&*])/.test(val)) {
        return createError(
          'Password must contain at least 1 special character (!@#$%^&*).'
        );
      }

      return true;
    })
    .required(),
  passwordConfirmation: yup
    .string()
    .required("Password doesn't match.")
    .oneOf([yup.ref('password')], "Password doesn't match."),
});

type RegisterFormValues = yup.InferType<typeof registerFormSchema>;

const RegisterPage: FC = () => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
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

  useEffect(() => {
    document.body.classList.add('bg-slate-50');
  }, []);

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

  const isFormValid = Object.values(errors).every((error) => error == null);

  return (
    <>
      <h1 className="text-3xl font-semibold text-center mt-12">posad</h1>
      <div className="flex justify-center items-center px-6 mt-6 mb-12">
        <div className="flex flex-col w-full max-w-[478px] bg-white border border-slate-100 shadow-md shadow-slate-200/50 px-6 pt-4 pb-8">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <h2 className="text-2xl font-medium text-center mb-8">Welcome!</h2>

            <div className="flex flex-col gap-6">
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

                {errors.password != null && (
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

                {errors.passwordConfirmation != null && (
                  <div className="text-red-500 mt-2">
                    {errors.passwordConfirmation?.message}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={clsx(
                'mt-4 w-full bg-primary-blue text-white py-2.5 rounded-md',
                'flex justify-center',
                'transition duratino-200',
                'hover:bg-primary-blue/80',
                'disabled:cursor-not-allowed',
                !isLoading && 'disabled:bg-gray-200 disabled:text-gray-400'
              )}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? <DotsSpinner className="text-white" /> : 'Register'}
            </button>

            <div className="text-red-500 mt-2">{errorMessage}</div>
          </form>

          <div className="flex items-center mt-6 -mx-1.5">
            <div className="h-px bg-slate-300 flex-1"></div>
            <div className="px-2 flex-1 text-center text-slate-500 leading-5">
              or register with
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
            </button>
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
