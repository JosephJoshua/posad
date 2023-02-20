import { FC, useRef, useState } from 'react';
import { DashboardLayout } from '@posad/react-core/layouts/dashboard';
import { IconClock } from '@tabler/icons-react';
import { WentBadContainer } from '@posad/react-features/home';
import useResizeObserver from '@react-hook/resize-observer';
import clsx from 'clsx';

const HomePage: FC = () => {
  const expiringSoonContainer = useRef<HTMLDivElement>(null);
  const [isExpireContainerOverflowing, setExpireContainerOverflowing] =
    useState<boolean>(false);

  const checkExpireContainerOverflow = (el: Element) => {
    setExpireContainerOverflowing(el.scrollWidth > el.clientWidth);
  };

  useResizeObserver(expiringSoonContainer, (entry) =>
    checkExpireContainerOverflow(entry.target)
  );

  return (
    <DashboardLayout className="flex flex-col gap-4">
      <div className="bg-dark-gray text-white p-5 rounded-2xl">
        <h2 className="font-medium text-xl">Expiring soon</h2>

        <div
          className={clsx(
            'flex gap-6 mt-4 overflow-x-scroll scrollbar-thin scrollbar-track-dark-gray scrollbar-thumb-gray-100',
            isExpireContainerOverflowing && 'pb-6'
          )}
          ref={expiringSoonContainer}
        >
          {Array.from({ length: 4 }, (_, idx) => (
            <div className="flex flex-col gap-3 font-medium" key={idx}>
              <div className="w-[312px] h-[192px] bg-gray-100 rounded-2xl"></div>
              <div className="flex justify-between px-1">
                <span>Carrots</span>
                <div className="flex items-center gap-2">
                  <IconClock />
                  <span>2d</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WentBadContainer />
    </DashboardLayout>
  );
};

export default HomePage;
