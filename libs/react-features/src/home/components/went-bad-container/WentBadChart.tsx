import { useCallback, useMemo } from 'react';
import { GridRows, GridColumns } from '@visx/grid';
import { AreaClosed, Bar, LinePath } from '@visx/shape';
import { scaleLinear, scaleTime } from '@visx/scale';
import { bisector, extent, max } from 'd3-array';
import { curveMonotoneX } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { Axis } from '@visx/axis';
import { localPoint } from '@visx/event';
import { Tooltip, withTooltip } from '@visx/tooltip';
import { roundDate } from '@posad/business-logic/utils';
import { AnimatePresence, m } from 'framer-motion';
import dayjs from 'dayjs';
import clsx from 'clsx';

export type DateRepresentation = 'date' | 'dayOfWeek' | 'month';

export type WentBadDataPoint = {
  value: number;
  date: Date;
};

export type WentBadChartProps = {
  width: number;
  height: number;
  data: WentBadDataPoint[];
  dateRepresentation?: DateRepresentation;
};

const getDate = (dp: WentBadDataPoint) => dp.date;
const getValue = (dp: WentBadDataPoint) => dp.value;

const bisectDate = bisector<WentBadDataPoint, Date>(getDate).left;

const marginTop = 16;
const marginLeft = 16;
const marginRight = 16;

const axisHeight = 50;

const tooltipSpacing = 32;

const AnimatedTooltip = m(Tooltip);

const WentBadChart = withTooltip<WentBadChartProps, WentBadDataPoint>(
  ({
    width,
    height,
    data,
    showTooltip,
    hideTooltip,
    tooltipData,
    dateRepresentation = 'date',
    tooltipLeft = 0,
    tooltipTop = 0,
  }) => {
    const innerWidth = width - marginLeft - marginRight;
    const outerHeight = height + axisHeight;

    const getDateRepresentation = (dateArg: Date) => {
      const date = dayjs(dateArg);

      switch (dateRepresentation) {
        case 'date':
          return date.format('DD');

        case 'dayOfWeek':
          return date.format('ddd');

        case 'month':
          return date.format('MMM');

        default:
          return '';
      }
    };

    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [marginLeft, innerWidth + marginLeft],
          domain: extent(data, getDate) as [Date, Date],
        }),
      [data, innerWidth]
    );

    const valueScale = useMemo(() => {
      return scaleLinear({
        range: [height, marginTop],
        domain: [0, max(data, getValue) ?? 0],
      });
    }, [data, height]);

    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
      ) => {
        const { x } = localPoint(event) || { x: 0 };
        const date = roundDate(
          dateScale.invert(x),
          dateRepresentation === 'month' ? 'month' : 'day'
        );

        const dp = data[bisectDate(data, date)];

        showTooltip({
          tooltipData: dp,
          tooltipLeft: dateScale(date),
          tooltipTop: valueScale(getValue(dp)),
        });
      },
      [valueScale, dateScale, showTooltip, data, dateRepresentation]
    );

    const isDateHighlighted = (date: Date) => {
      if (tooltipData == null) return false;
      return dayjs(tooltipData.date).isSame(dayjs(date), 'day');
    };

    return (
      <>
        <svg width={width} height={outerHeight}>
          <LinearGradient id="area-gradient">
            <stop
              offset="0%"
              stopColor="currentColor"
              className="text-blue-50"
            />

            <stop
              offset="20%"
              stopColor="currentColor"
              className="text-blue-100"
            />

            <stop
              offset="40%"
              stopColor="currentColor"
              className="text-blue-200"
            />

            <stop
              offset="100%"
              stopColor="currentColor"
              className="text-blue-500"
            />
          </LinearGradient>

          <GridRows
            className="stroke-green-200"
            scale={valueScale}
            width={width}
            strokeDasharray="1,3"
            strokeOpacity={0}
            pointerEvents="none"
          />

          <GridColumns
            className="stroke-green-200"
            scale={dateScale}
            height={height}
            strokeDasharray="1,4"
            strokeOpacity={0.4}
            pointerEvents="none"
          />

          <AreaClosed<WentBadDataPoint>
            data={data}
            x={(d) => dateScale(d.date) ?? 0}
            y={(d) => valueScale(d.value) ?? 0}
            yScale={valueScale}
            curve={curveMonotoneX}
            fill="url(#area-gradient)"
          />

          <LinePath<WentBadDataPoint>
            data={data}
            x={(d) => dateScale(d.date) ?? 0}
            y={(d) => valueScale(d.value) ?? 0}
            curve={curveMonotoneX}
            stroke="white"
            strokeWidth={3}
            shapeRendering="geometricPrecision"
          />

          <Axis
            scale={dateScale}
            top={height + axisHeight / 2}
            numTicks={data.length}
            tickFormat={(val) => getDateRepresentation(val as Date)}
            tickLabelProps={(date) => ({
              className: clsx(
                'text-center',
                'transition duration-200',
                data.length > 14 && 'hidden md:block',
                data.length > 10
                  ? 'text-xs lg:text-sm xl:text-base'
                  : 'text-base',
                isDateHighlighted(date as Date) ? 'fill-white' : 'fill-gray-300'
              ),
              textAnchor: 'middle',
            })}
            orientation="bottom"
            hideAxisLine
            hideTicks
          />

          <Bar
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />

          <AnimatePresence>
            {tooltipData && (
              <m.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.2,
                }}
              >
                <m.line
                  initial={{
                    x: tooltipLeft,
                  }}
                  animate={{
                    x: tooltipLeft,
                    y1: tooltipTop,
                    y2: height,
                  }}
                  transition={{
                    bounce: 0,
                  }}
                  className="stroke-primary-blue"
                  strokeWidth={2}
                  pointerEvents="none"
                  strokeDasharray="3,5"
                />

                <m.circle
                  animate={{
                    cx: tooltipLeft,
                    cy: tooltipTop,
                  }}
                  transition={{
                    bounce: 0,
                  }}
                  r={8}
                  className="fill-primary-blue stroke-white"
                  strokeWidth={2}
                  pointerEvents="none"
                />
              </m.g>
            )}
          </AnimatePresence>
        </svg>

        <AnimatePresence>
          {tooltipData && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
              }}
            >
              <AnimatedTooltip
                initial={{
                  top: tooltipTop - tooltipSpacing,
                  left: tooltipLeft,
                }}
                animate={{
                  top: tooltipTop - tooltipSpacing,
                  left: tooltipLeft,
                }}
                className={clsx(
                  'absolute translate-x-[-50%] translate-y-[-50%]',
                  'bg-primary-blue border border-white text-white',
                  'px-4 rounded-md text-center'
                )}
              >
                {getValue(tooltipData)}
              </AnimatedTooltip>
            </m.div>
          )}
        </AnimatePresence>
      </>
    );
  }
);

export default WentBadChart;
