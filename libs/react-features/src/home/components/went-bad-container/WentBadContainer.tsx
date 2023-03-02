import { FC, useEffect, useMemo, useState } from 'react';
import { ParentSize } from '@visx/responsive';
import WentBadChart, {
  DateRepresentation,
  WentBadDataPoint,
} from './WentBadChart';
import { listenToProductsWentBadAggregation } from '@posad/business-logic/features/home';
import { useAuthContext } from '@posad/react-core/libs/firebase';
import TimeframeSelect, { Timeframe } from './TimeframeSelect';
import dayjs from 'dayjs';

const dateRepresentation: Record<Timeframe, DateRepresentation> = {
  week: 'dayOfWeek',
  month: 'date',
  year: 'month',
};

const WentBadContainer: FC = () => {
  const { firebaseUser } = useAuthContext();

  const [data, setData] = useState<WentBadDataPoint[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('week');

  const [startDate, endDate] = useMemo(() => {
    const today = dayjs();
    return [today.subtract(1, selectedTimeframe), today];
  }, [selectedTimeframe]);

  useEffect(() => {
    if (firebaseUser == null) return;

    const unsubscribe = listenToProductsWentBadAggregation(
      firebaseUser.uid,
      startDate.toDate(),
      endDate.toDate(),
      selectedTimeframe === 'year' ? 'month' : 'day',
      (dps) =>
        setData(
          dps.map((dp) => ({
            date: dp.date,
            value: dp.qty,
          }))
        )
    );

    return () => unsubscribe();
  }, [firebaseUser, startDate, endDate, selectedTimeframe]);

  return (
    <div className="bg-blue-500 text-white p-5 rounded-2xl">
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-xl">Products went bad</h2>
        <TimeframeSelect
          value={selectedTimeframe}
          onChange={setSelectedTimeframe}
        />
      </div>

      <ParentSize className="mt-4">
        {({ width }) => (
          <WentBadChart
            data={data}
            width={width}
            height={200}
            dateRepresentation={dateRepresentation[selectedTimeframe]}
          />
        )}
      </ParentSize>
    </div>
  );
};

export default WentBadContainer;
