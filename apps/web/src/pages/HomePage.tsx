import { FC } from 'react';
import { DashboardLayout } from '@posad/react-core/layouts/dashboard';
import { useTitle } from '@posad/react-core/hooks';
import {
  WentBadContainer,
  ExpiringSoonContainer,
} from '@posad/react-features/home';

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
