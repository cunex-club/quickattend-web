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

// CONSTANTS

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
] as const;

const BAR_CONSTANTS = {
  RADIUS: 2,
  LABEL_OFFSET: 8,
  LABEL_FONT_SIZE: 14,
  SIZE_DESKTOP: 28,
  SIZE_TABLET: 15,
  SIZE_MOBILE: 22,
  OPACITY_ACTIVE: 1,
  OPACITY_INACTIVE: 0.2,
} as const;

// TYPES

interface TransformedDataEntry extends Record<string, string | number> {
  faculty: string;
}

// HELPER FUNCTIONS

const transformDataForChart = (
  data: BarChartVerticalMultiProps["data"]
): TransformedDataEntry[] => {
  if (!data || data.length === 0) return [];

  return data.map(({ faculty, data: timeData }) => {
    const entry: TransformedDataEntry = { faculty };
    timeData.forEach(({ time, total }) => {
      entry[time] = total;
    });
    return entry;
  });
};

const extractTimeLabels = (
  data: BarChartVerticalMultiProps["data"]
): string[] => {
  const times = new Set<string>();
  data.forEach(({ data: timeData }) => {
    timeData.forEach(({ time }) => {
      times.add(time);
    });
  });
  return Array.from(times);
};

const getResponsiveBarSize = (isMobile: boolean, isTablet: boolean): number => {
  if (isMobile) return BAR_CONSTANTS.SIZE_MOBILE;
  if (isTablet) return BAR_CONSTANTS.SIZE_TABLET;
  return BAR_CONSTANTS.SIZE_DESKTOP;
};

// Component

export function BarChartVerticalMulti({ data }: BarChartVerticalMultiProps) {
  // Hooks - must be called first
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // State
  const [hoveredSeriesIndex, setHoveredSeriesIndex] = useState<number | null>(
    null
  );
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Computed values
  const chartData = transformDataForChart(data);
  const timeArray = extractTimeLabels(data);
  const barSize = getResponsiveBarSize(isMobile, isTablet);

  // Event handlers
  const handleBackgroundClick = () => {
    setIsLocked(false);
    setHoveredSeriesIndex(null);
  };

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
                style={{ height: `${timeArray.length * barSize}px` }}
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
                      radius={BAR_CONSTANTS.RADIUS}
                      barSize={barSize}
                      // the shape prop is used to customize the shape of the bar
                      shape={(props: unknown) => {
                        const { x, y, width, height, fill } = props as {
                          x: number;
                          y: number;
                          width: number;
                          height: number;
                          fill: string;
                        };
                        const opacity =
                          hoveredSeriesIndex === null ||
                          hoveredSeriesIndex === seriesIndex
                            ? BAR_CONSTANTS.OPACITY_ACTIVE
                            : BAR_CONSTANTS.OPACITY_INACTIVE;

                        return (
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            fill={fill}
                            rx={BAR_CONSTANTS.RADIUS}
                            ry={BAR_CONSTANTS.RADIUS}
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
                        offset={BAR_CONSTANTS.LABEL_OFFSET}
                        className="fill-foreground hidden md:block"
                        fontSize={BAR_CONSTANTS.LABEL_FONT_SIZE}
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
