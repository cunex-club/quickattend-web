"use client";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  LabelList,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";
import { BarChartHorizontalMultiProps } from "@customTypes/chart";
import { cn } from "@assets/lib/utils";

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

const CHART_CONSTANTS = {
  BAR_SPACING: 0,
  BAR_RADIUS: 2,
  LABEL_OFFSET: 8,
  LABEL_FONT_SIZE: 14,
  STROKE_DASH_ARRAY: "3 3",
  OPACITY_ACTIVE: 1,
  OPACITY_INACTIVE: 0.2,
} as const;

// TYPES

interface TransformedDataEntry extends Record<string, string | number> {
  time: string;
}

// HELPER FUNCTIONS

const transformDataForChart = (
  data: BarChartHorizontalMultiProps["data"]
): TransformedDataEntry[] => {
  if (!data || data.length === 0) return [];

  const timeMap = new Map<string, TransformedDataEntry>();

  // Collect all unique times and faculty data
  data.forEach(({ faculty, data: timeData }) => {
    timeData.forEach(({ time, total }) => {
      if (!timeMap.has(time)) {
        timeMap.set(time, { time });
      }
      const entry = timeMap.get(time)!;
      entry[faculty] = total;
    });
  });

  return Array.from(timeMap.values());
};

const extractFacultyNames = (
  data: BarChartHorizontalMultiProps["data"]
): string[] => {
  return data.map((item) => item.faculty);
};

// COMPONENT

export function BarChartHorizontalMulti({
  data,
}: BarChartHorizontalMultiProps) {
  // State
  const [hoveredSeriesIndex, setHoveredSeriesIndex] = useState<number | null>(
    null
  );
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Computed values
  const chartData = transformDataForChart(data);
  const faculties = extractFacultyNames(data);

  // Event handlers
  const handleBackgroundClick = () => {
    setIsLocked(false);
    setHoveredSeriesIndex(null);
  };

  return (
    <Card className="px-0 border-none shadow-none">
      <CardContent
        className="px-0 overflow-auto"
        onClick={handleBackgroundClick}
      >
        <div className={cn("min-w-[1000px] sm:min-w-[2000px] md:min-w-[1500px] lg:min-w-[1300px] w-full",
          data.length > 5 ? "min-w-[2000px] sm:min-w-[2500px] md:min-w-[2500px] lg:min-w-[2500px]" : ""
        )}>
          <ChartContainer
            config={chartConfig}
            className="w-full pr-3 h-[250px] md:h-[450px]"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              barGap={CHART_CONSTANTS.BAR_SPACING}
              barCategoryGap={60}
            >
              <CartesianGrid
                horizontal={true}
                vertical={false}
                stroke="var(--color-gray-300)"
                strokeWidth={0.4}
                strokeDasharray={CHART_CONSTANTS.STROKE_DASH_ARRAY}
              />
              <XAxis
                dataKey="time"
                tickLine={false}
                tickMargin={10}
                axisLine={true}
              />
              <YAxis
                type="number"
                tickLine={false}
                axisLine={true}
                tickFormatter={(value) => value.toString()}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
                
              />
              {faculties.map((faculty, index) => (
                <Bar
                  key={faculty}
                  dataKey={faculty}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  radius={CHART_CONSTANTS.BAR_RADIUS}
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
                      hoveredSeriesIndex === index
                        ? CHART_CONSTANTS.OPACITY_ACTIVE
                        : CHART_CONSTANTS.OPACITY_INACTIVE;

                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={fill}
                        opacity={opacity}
                        rx={CHART_CONSTANTS.BAR_RADIUS}
                        ry={CHART_CONSTANTS.BAR_RADIUS}
                        className="transition-opacity duration-200"
                        onMouseEnter={() => {
                          if (!isLocked) {
                            setHoveredSeriesIndex(index);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isLocked) {
                            setHoveredSeriesIndex(null);
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isLocked && hoveredSeriesIndex === index) {
                            setIsLocked(false);
                            setHoveredSeriesIndex(null);
                          } else {
                            setIsLocked(true);
                            setHoveredSeriesIndex(index);
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    );
                  }}
                >
                  <LabelList
                    dataKey={faculty}
                    position="top"
                    offset={CHART_CONSTANTS.LABEL_OFFSET}
                    className="fill-foreground"
                    fontSize={CHART_CONSTANTS.LABEL_FONT_SIZE}
                  />
                </Bar>
              ))}
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>

      {/* Legend section */}
      <div className="w-full flex justify-center">
        <div className="flex flex-row flex-wrap gap-4 justify-center items-center space-x-8 md:space-x-16 px-10">
          {faculties.map((faculty, index) => (
            <div key={faculty} className="flex flex-row space-x-2 items-center">
              <div
                className="w-4 h-4"
                style={{
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                }}
              />
              <p className="label-small-primary">{faculty}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
