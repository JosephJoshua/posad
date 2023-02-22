import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { type User } from '../../../../business-logic/src/types';
import { FC } from 'react';
import {
  auth,
  collections,
} from '../../../../business-logic/src/libs/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export type AuthContextProps = {
  firebaseUser: FirebaseUser | null;
  userData: User | null;
  error: Error | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export type AuthContextProviderProps = PropsWithChildren;

export const AuthContextProvider: FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setFirebaseUser(user);
        if (user == null) setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (firebaseUser == null) return;

    const unsubscribe = onSnapshot(
      doc(collections.users, firebaseUser.uid),
      (snapshot) => {
        const data = snapshot.data();

        if (data != null) setUserData({ ...data, id: snapshot.id });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firebaseUser]);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userData,
        error,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const data = useContext(AuthContext);
  if (data === undefined) {
    throw new Error(
      '`useAuthContext()` must be used inside of an `AuthContextProvider`'
    );
  }

  return {
    ...data,
    isAuthenticated: data.firebaseUser != null && data.firebaseUser != null,
  };
};
