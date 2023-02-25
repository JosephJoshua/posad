import { FC } from 'react';
import { ReactComponent as DotsSpinner } from '../../../assets/spinners/dots.svg';

const LoadingPage: FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <DotsSpinner className="w-[48px] h-[48px]" />
    </div>
  );
};

export default LoadingPage;
