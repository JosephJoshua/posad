import { AuthContextProvider } from '@posad/react-core/libs/firebase';
import { initDayjs } from '@posad/react-core/libs/dayjs';
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { LazyMotion, domAnimation } from 'framer-motion';
import * as ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

initDayjs();

root.render(
  <StrictMode>
    <LazyMotion features={domAnimation} strict>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </LazyMotion>
  </StrictMode>
);
