import { useCallback, useMemo } from 'react';
import { GridRows, GridColumns } from '@visx/grid';
import { AreaClosed, Bar, Line, LinePath } from '@visx/shape';
import { scaleLinear, scaleTime } from '@visx/scale';
import { bisector, extent, max } from 'd3-array';
import { curveMonotoneX } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { Axis } from '@visx/axis';
import { localPoint } from '@visx/event';
import { TooltipWithBounds, withTooltip } from '@visx/tooltip';
import { roundDate } from '@posad/business-logic/utils';
import dayjs from 'dayjs';

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
            strokeWidth={3}
            shapeRendering="geometricPrecision"
            stroke="white"
            curve={curveMonotoneX}
          />

          <Axis
            scale={dateScale}
            top={height + axisHeight / 2}
            numTicks={data.length}
            tickFormat={(val) => getDateRepresentation(val as Date)}
            tickLabelProps={() => ({
              className: 'text-base text-center fill-gray-200',
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

          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: tooltipTop }}
                to={{ x: tooltipLeft, y: height }}
                className="stroke-primary-blue"
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="3,5"
              />

              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={8}
                className="fill-primary-blue stroke-white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>

        {tooltipData && (
          <div>
            <TooltipWithBounds
              top={tooltipTop - 56}
              left={tooltipLeft - 32}
              className="bg-primary-blue min-w-[48px] text-center origin-center border border-white text-white"
            >
              {getValue(tooltipData)}
            </TooltipWithBounds>
          </div>
        )}
      </>
    );
  }
);

export default WentBadChart;
