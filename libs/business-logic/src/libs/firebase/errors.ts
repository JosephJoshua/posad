import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';
import { StorageError, StorageErrorCode } from 'firebase/storage';

export const handleStorageError = (error: StorageError) => {
  switch (error.code) {
    case StorageErrorCode.UNAUTHENTICATED:
    case StorageErrorCode.UNAUTHORIZED:
      throw new Error("You're not authorized to upload this file!");

    case StorageErrorCode.OBJECT_NOT_FOUND:
      throw new Error('File could not be found.');

    case StorageErrorCode.UNKNOWN:
      throw new Error('An unknown error occured while uploading the file!');

    case StorageErrorCode.CANCELED:
      return;

    default:
      throw error;
  }
};

export const handleAuthError = (err: unknown) => {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      /**
       * We don't want to show an error if the popup was closed.
       */
      case AuthErrorCodes.POPUP_CLOSED_BY_USER:
      case AuthErrorCodes.EXPIRED_POPUP_REQUEST:
        return;

      case AuthErrorCodes.POPUP_BLOCKED:
        throw new Error(
          'Popup was blocked! Please enable popups for this website in your browser settings.'
        );

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
