"use client";
import { useState } from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";
import { BarChartVerticalMultiProps } from "@customTypes/chart";
import { useIsMobile, useIsTablet } from "@assets/hooks/use-mobile";

export const description = "A multiple bar chart";

const chartConfig = {
  XAxis: {
    color: "var(--color-neutral-400)",
  },
  YAxis: {
    color: "var(--color-neutral-400)",
  },
  CartesianGrid: {
    color: "var(--color-gray-300)",
  },
} satisfies ChartConfig;

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function BarChartVerticalMulti({ data }: BarChartVerticalMultiProps) {
  const BAR_RADIUS = 2;
  const LABEL_OFFSET: number = 8;
  const LABEL_FONT_SIZE: number = 14;

  // Track which series (time/color) is being hovered
  const [hoveredSeriesIndex, setHoveredSeriesIndex] = useState<number | null>(
    null
  );
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Transform nested data structure to flat structure for vertical display
  // From: [{faculty, data: [{time, total}]}]
  // To: [{faculty: faculty1, time1: total, time2: total, ...}, {faculty: faculty2, ...}]
  const transformData = () => {
    if (!data || data.length === 0) return [];

    return data.map(({ faculty, data: timeData }) => {
      const entry: Record<string, string | number> = { faculty };
      timeData.forEach(({ time, total }) => {
        entry[time] = total;
      });
      return entry;
    });
  };

  const chartData = transformData();

  // Extract time labels for series (all unique times from all faculty data)
  const times = new Set<string>();
  data.forEach(({ data: timeData }) => {
    timeData.forEach(({ time }) => {
      times.add(time);
    });
  });
  const timeArray = Array.from(times);

  const handleBackgroundClick = () => {
    setIsLocked(false);
    setHoveredSeriesIndex(null);
  };

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  let BAR_SIZE: number = 28;
  if (isMobile) {
    BAR_SIZE = 22;
  } else if (isTablet) {
    BAR_SIZE = 15;
  }

  return (
    <Card className="bg-neutral-100 border-none shadow-none">
      <CardContent
        className="mx-0 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-10 py-6 md:py-2 overflow-y-auto h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px] "
        onClick={() => {
          handleBackgroundClick();
        }}
      >
        <div className="chart-list-group flex flex-col space-y-8">
          {data.map((facultyData, idx) => (
            <div
              key={`faculty-chart-${idx}`}
              className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4"
            >
              {/* Custom label for faculty name */}
              <div className="flex lg:col-span-1">
                <p className="title-large-primary">{facultyData.faculty}</p>
              </div>

              {/* Chart container for this faculty's bars */}
              <ChartContainer
                config={chartConfig}
                style={{ height: `${timeArray.length * BAR_SIZE}px` }}
                className="w-full lg:col-span-2"
              >
                <BarChart
                  accessibilityLayer
                  data={[chartData[idx]]}
                  layout="vertical"
                  margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
                >
                  <YAxis
                    dataKey="faculty"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    hide
                  />
                  <XAxis type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />

                  {timeArray.map((time, seriesIndex) => (
                    <Bar
                      key={time}
                      dataKey={time}
                      fill={CHART_COLORS[seriesIndex % CHART_COLORS.length]}
                      radius={BAR_RADIUS}
                      barSize={BAR_SIZE}
                      // the shape prop is used to customize the shape of the bar
                      shape={(props: any) => {
                        const { x, y, width, height, fill } = props;
                        const opacity =
                          hoveredSeriesIndex === null ||
                          hoveredSeriesIndex === seriesIndex
                            ? 1
                            : 0.2;

                        return (
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            fill={fill} // use fill from props
                            rx={BAR_RADIUS}
                            ry={BAR_RADIUS}
                            opacity={opacity}
                            className="transition-opacity duration-200"
                            // add event handlers that will handle the hover and click events
                            onClick={(e) => {
                              e.stopPropagation();
                              setHoveredSeriesIndex(
                                !isLocked ? seriesIndex : null
                              );
                              setIsLocked(!isLocked);
                            }}
                            // add mouse enter and leave events to handle the hover state
                            onMouseEnter={() => {
                              if (!isLocked) setHoveredSeriesIndex(seriesIndex);
                            }}
                            // add mouse leave event to handle the hover state
                            onMouseLeave={() => {
                              if (!isLocked) setHoveredSeriesIndex(null);
                            }}
                          />
                        );
                      }}
                    >
                      <LabelList
                        dataKey={time}
                        position="right"
                        offset={LABEL_OFFSET}
                        className="fill-foreground hidden md:block"
                        fontSize={LABEL_FONT_SIZE}
                      />
                    </Bar>
                  ))}
                </BarChart>
              </ChartContainer>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Legend section */}
      <div className="w-full flex justify-center">
        <div className="flex flex-row flex-wrap gap-4 justify-center items-center space-x-8 md:space-x-16 px-10">
          {timeArray.map((time, index) => (
            <div key={time} className="flex flex-row space-x-2 items-center">
              <div
                className="w-4 h-4"
                style={{
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                }}
              />
              <p className="label-small-primary">{time}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
