import { useCallback, useMemo } from 'react';
import { GridRows, GridColumns } from '@visx/grid';
import { AreaClosed, Bar, Line } from '@visx/shape';
import { scaleLinear, scaleUtc } from '@visx/scale';
import { bisector, extent, max } from 'd3-array';
import { curveNatural } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { Axis } from '@visx/axis';
import { localPoint } from '@visx/event';
import { TooltipWithBounds, withTooltip } from '@visx/tooltip';

export type WentBadDataPoint = {
  value: number;
  date: Date;
};

export type WentBadChartProps = {
  width: number;
  height: number;
  data: WentBadDataPoint[];
};

const getDate = (dp: WentBadDataPoint) => dp.date;
const getValue = (dp: WentBadDataPoint) => dp.value;

const bisectDate = bisector<WentBadDataPoint, Date>((dp) => dp.date).left;

const scalePadding = 40;
const strokeSize = 2;

const WentBadChart = withTooltip<WentBadChartProps, WentBadDataPoint>(
  ({
    width,
    height,
    data,
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  }) => {
    const outerHeight = height + scalePadding;

    const dateScale = useMemo(
      () =>
        scaleUtc({
          range: [-strokeSize, width + strokeSize],
          domain: extent(data, getDate) as [Date, Date],
        }),
      [data, width]
    );

    const valueScale = useMemo(() => {
      const high = max(data, getValue) ?? 0;
      return scaleLinear({
        range: [outerHeight + strokeSize, strokeSize],

        /**
         * Get the percentage that the `scalePadding` takes up
         * in terms of the height and map that to be in terms
         * of the highest data value.
         */
        domain: [(scalePadding / outerHeight) * high * -1, high],
        nice: true,
      });
    }, [data, outerHeight]);

    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
      ) => {
        const { x } = localPoint(event) || { x: 0 };

        const x0 = dateScale.invert(x);
        const idx = bisectDate(data, x0, 1);

        const d0 = data[idx - 1];
        const d1 = data[idx];

        let d = d0;

        if (d1 != null && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }

        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: valueScale(getValue(d)),
        });
      },
      [valueScale, dateScale, showTooltip, data]
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
            height={outerHeight}
            strokeDasharray="1,4"
            strokeOpacity={0.4}
            pointerEvents="none"
          />

          <AreaClosed<WentBadDataPoint>
            data={data}
            x={(d) => dateScale(d.date) ?? 0}
            y={(d) => valueScale(d.value) ?? 0}
            yScale={valueScale}
            strokeWidth={2}
            curve={curveNatural}
            fill="url(#area-gradient)"
            className="from-blue-50 to-blue-500 stroke-white"
          />

          <Axis
            scale={dateScale}
            top={height}
            numTicks={data.length}
            tickFormat={(val) => (val as Date).getDate().toString()}
            tickLabelProps={() => ({
              className: 'text-base fill-gray-200',
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
