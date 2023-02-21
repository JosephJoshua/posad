import { FC } from 'react';
import { DashboardLayout } from '@posad/react-core/layouts/dashboard';
import {
  WentBadContainer,
  ExpiringSoonContainer,
} from '@posad/react-features/home';
import { useTitle } from 'libs/react-core/src/hooks';

const HomePage: FC = () => {
  useTitle('Home | Posad');

  return (
    <DashboardLayout className="flex flex-col gap-4">
      <ExpiringSoonContainer />
      <WentBadContainer />
    </DashboardLayout>
  );
};

export default HomePage;
