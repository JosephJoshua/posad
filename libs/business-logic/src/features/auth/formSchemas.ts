import * as yup from 'yup';

export const loginFormSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export type LoginFormValues = yup.InferType<typeof loginFormSchema>;

export const registerFormSchema = yup.object({
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

export type RegisterFormValues = yup.InferType<typeof registerFormSchema>;
