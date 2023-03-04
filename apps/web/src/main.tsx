import { initDayjs } from '@posad/react-core/libs/dayjs';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { requestForMessagingToken } from '@posad/business-logic/libs/firebase';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

initDayjs();

/**
 * TODO: add custom modal to ask for notification permissions.
 */
requestForMessagingToken();

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
