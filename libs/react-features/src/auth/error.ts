import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';

export const handleAuthError = (err: unknown) => {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        throw new Error('This email is already in use.');

      case AuthErrorCodes.INVALID_EMAIL:
        throw new Error('Invalid email!');

      case AuthErrorCodes.WEAK_PASSWORD:
        throw new Error('Please use a stronger password.');

      case AuthErrorCodes.INVALID_PASSWORD:
      case AuthErrorCodes.USER_DELETED:
        throw new Error('Invalid credentials!');

      case AuthErrorCodes.USER_DISABLED:
        throw new Error('This user has been disabled.');

      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        throw new Error('Too many login attempts! Please try again later.');

      case AuthErrorCodes.OPERATION_NOT_ALLOWED:
        throw new Error('This operation is not allowed.');

      case AuthErrorCodes.TIMEOUT:
        throw new Error('Operation timed out. Please try again.');

      default:
        throw err;
    }
  }

  throw err;
};
