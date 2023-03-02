import { Listbox, Transition } from '@headlessui/react';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import clsx from 'clsx';
import { FC, Fragment } from 'react';

const timeframes = {
  week: 'This week',
  month: 'This month',
  year: 'This year',
} as const;

export type Timeframe = keyof typeof timeframes;

export type TimeframeSelectProps = {
  value: Timeframe;
  onChange: (newValue: Timeframe) => void;
};

const TimeframeSelect: FC<TimeframeSelectProps> = ({ value, onChange }) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className={clsx(
            'relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md',
            'focus:outline-none focus-visible:border-primary-blue focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-opacity-75',
            'sm:text-sm'
          )}
        >
          <span className="block truncate text-primary-blue pr-5">
            {timeframes[value]}
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
  );
};

export default TimeframeSelect;
