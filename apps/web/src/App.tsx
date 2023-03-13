import { FC } from 'react';
import { RouterProvider } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import { AuthContextProvider } from '@posad/react-core/libs/firebase';
import router from './router';
import { messaging } from '@posad/business-logic/libs/firebase';
import { onMessage } from 'firebase/messaging';
import { IconExclamationCircle } from '@tabler/icons-react';
import { Toaster } from 'react-hot-toast';
import notify from './utils/notify';

onMessage(messaging, (payload) => {
  const { notification } = payload;

  if (notification == null) return;

  notify({
    title: notification.title ?? 'Posad',
    message: notification.body ?? '',
    icon: IconExclamationCircle,
  });
});

const App: FC = () => {
  return (
    <LazyMotion features={domAnimation} strict>
      <AuthContextProvider>
        <RouterProvider router={router} />;
        <Toaster />
      </AuthContextProvider>
    </LazyMotion>
  );
};

export default App;
