import { FC, Fragment, useState } from 'react';
import { ParentSize } from '@visx/responsive';
import { Listbox, Transition } from '@headlessui/react';
import WentBadChart from './WentBadChart';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import clsx from 'clsx';

type Timeframe = 'week' | 'month' | 'year';

const timeframes: Record<Timeframe, string> = {
  week: 'This week',
  month: 'This month',
  year: 'This year',
} as const;

const WentBadContainer: FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('week');

  return (
    <div className="bg-blue-500 text-white p-5 rounded-2xl">
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-xl">Products went bad</h2>

        <Listbox value={selectedTimeframe} onChange={setSelectedTimeframe}>
          <div className="relative">
            <Listbox.Button
              className={clsx(
                'relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md',
                'focus:outline-none focus-visible:border-primary-blue focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-opacity-75',
                'sm:text-sm'
              )}
            >
              <span className="block truncate text-primary-blue pr-5">
                {timeframes[selectedTimeframe]}
              </span>

              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <IconChevronDown
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={clsx(
                  'absolute mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5',
                  'first-letter:absolute',
                  'focus:outline-none',
                  'sm:text-sm'
                )}
              >
                {Object.entries(timeframes).map(([key, value]) => (
                  <Listbox.Option
                    key={key}
                    className={({ active }) =>
                      clsx(
                        'relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900',
                        active && 'bg-gray-100'
                      )
                    }
                    value={key}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={clsx(
                            'block truncate',
                            selected ? 'font-medium' : 'font-normal'
                          )}
                        >
                          {value}
                        </span>

                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                            <IconCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

      <ParentSize className="mt-4">
        {({ width }) => (
          <WentBadChart
            data={[
              { date: new Date(2023, 2, 20), value: 50 },
              { date: new Date(2023, 2, 21), value: 51 },
              { date: new Date(2023, 2, 22), value: 43 },
              { date: new Date(2023, 2, 23), value: 30 },
              { date: new Date(2023, 2, 24), value: 76 },
              { date: new Date(2023, 2, 25), value: 57 },
            ]}
            width={width}
            height={200}
          />
        )}
      </ParentSize>
    </div>
  );
};

export default WentBadContainer;
