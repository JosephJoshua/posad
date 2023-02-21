import { FC, useEffect } from 'react';
import { DashboardLayout } from '@posad/react-core/layouts/dashboard';
import {
  WentBadContainer,
  ExpiringSoonContainer,
} from '@posad/react-features/home';

const HomePage: FC = () => {
  useEffect(() => {
    document.title = 'Home | Posad';
  }, []);

  return (
    <DashboardLayout className="flex flex-col gap-4">
      <ExpiringSoonContainer />
      <WentBadContainer />
    </DashboardLayout>
  );
};

export default HomePage;
