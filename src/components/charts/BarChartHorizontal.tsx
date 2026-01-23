"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";
import { BarChartHorizontalProps } from "@customTypes/chart";
import { useIsMobile, useIsTablet } from "@assets/hooks/use-mobile";
import { cn } from "@assets/lib/utils";
import IonIcon from "@shared/IonIcon";

// CONSTANTS

const chartConfig = {
  XAxis: {
    color: "var(--color-neutral-400)",
  },
  YAxis: {
    color: "var(--color-neutral-400)",
  },
  CartesianGrid: {
    color: "var(--color-neutral-300)",
  },
  total: {
    label: "total",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const detailChartConfig = {
  unregistered: {
    label: "จำนวนผู้ที่ยังไม่ได้ลงทะเบียน",
    color: "var(--chart-pink-200)",
  },
  registered: {
    label: "จำนวนผู้ลงทะเบียนสำเร็จ",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const CHART_CONSTANTS = {
  BAR_RADIUS: [8, 8, 0, 0] as [number, number, number, number],
  BAR_CATEGORY_GAP: 1,
  LABEL_OFFSET: 12,
  LABEL_FONT_SIZE: 12,
  WIDTH_PER_BAR_DESKTOP: 180,
  WIDTH_PER_BAR_TABLET: 150,
  WIDTH_PER_BAR_MOBILE: 100,
  STROKE_DASH_ARRAY: "3 3",
} as const;

// HELPER FUNCTIONS

const getChartWidth = (
  dataLength: number,
  isMobile: boolean,
  isTablet: boolean
): number => {
  if (isMobile) return dataLength * CHART_CONSTANTS.WIDTH_PER_BAR_MOBILE;
  if (isTablet) return dataLength * CHART_CONSTANTS.WIDTH_PER_BAR_TABLET;
  return dataLength * CHART_CONSTANTS.WIDTH_PER_BAR_DESKTOP;
};

// Component

export function BarChartHorizontal({
  data,
}: {
  data: BarChartHorizontalProps[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const chartWidth = getChartWidth(data.length, isMobile, isTablet);

  const handleBackgroundClick = () => {
    setHoveredIndex(null);
    setIsLocked(false);
  };

  const handleBarClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hoveredIndex === idx && isLocked) {
      setIsLocked(false);
      setHoveredIndex(null);
    } else {
      setHoveredIndex(idx);
      setIsLocked(true);
    }
  };

  const getOpacity = (idx: number) => {
    if (hoveredIndex === null) return 1;
    return hoveredIndex === idx ? 1 : 0.3;
  };

  const selectedItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  // Mock faculty data for the detail section - will be replaced with real data later
  const mockFacultyData = [
    { faculty: "วิศวกรรมศาสตร์", registered: 80, unregistered: 186 },
    { faculty: "อักษรศาสตร์", registered: 200, unregistered: 305 },
    { faculty: "วิทยาศาสตร์", registered: 190, unregistered: 73 },
  ].map((item) => ({
    ...item,
    total: item.registered + item.unregistered,
  }));

  const mockMaxValue = Math.max(...mockFacultyData.map((d) => d.total)) * 1.15;

  return (
    <Card className="p-0 border-none shadow-none">
      <CardContent className="px-0" onClick={handleBackgroundClick}>
        <div className="w-full overflow-x-auto">
          <ChartContainer
            config={chartConfig}
            className="h-[280px] md:h-[350px] lg:h-[400px] w-full pr-3 mb-4"
            style={{ minWidth: `${chartWidth}px` }}
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                top: 20,
              }}
              barCategoryGap={CHART_CONSTANTS.BAR_CATEGORY_GAP}
            >
              <CartesianGrid
                horizontal={true}
                vertical={false}
                stroke="var(--color-CartesianGrid)"
                strokeWidth={0.4}
                strokeDasharray={CHART_CONSTANTS.STROKE_DASH_ARRAY}
              />
              <XAxis
                dataKey="time"
                tickLine={false}
                tickMargin={10}
                axisLine={true}
                stroke={"var(--color-XAxis)"}
              />
              <YAxis
                type="number"
                dataKey="total"
                tickLine={false}
                tickMargin={10}
                axisLine={true}
                stroke={"var(--color-YAxis)"}
              />
              <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={CHART_CONSTANTS.BAR_RADIUS}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="var(--color-total)"
                    onMouseEnter={() => !isLocked && setHoveredIndex(index)}
                    onMouseLeave={() => !isLocked && setHoveredIndex(null)}
                    onClick={(e) =>
                      handleBarClick(index, e as unknown as React.MouseEvent)
                    }
                    style={{
                      cursor: "pointer",
                      opacity: getOpacity(index),
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  />
                ))}
                <LabelList
                  position="top"
                  offset={CHART_CONSTANTS.LABEL_OFFSET}
                  className="fill-neutral-black"
                  fontSize={CHART_CONSTANTS.LABEL_FONT_SIZE}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>

      {/* Selected item detail section */}
      <div
        className={cn(
          "rounded-xl transition-all duration-300 ease-in-out ",
          selectedItem && isLocked
            ? "opacity-100 h-[450px]"
            : "opacity-0 h-0 py-0 mt-0"
        )}
      >
        {selectedItem && isLocked && (
          <div className="flex flex-col h-full p-10 px-8 md:px-32 space-y-6 ">
            <div className="flex flex-row space-x-2 items-center">
              <IonIcon name="Time" size="16px" className="text-primary" />
              <p className="body-medium-primary">{selectedItem.time}</p>
            </div>
            {/* Mock faculty data for debugging - will be replaced with real data later */}
            <div className="flex flex-col space-y-4 flex-1 bg-neutral-100 p-8 rounded-[28px]">
              {mockFacultyData.map((item, idx) => {
                const percentage = (
                  (item.total /
                    mockFacultyData.reduce((sum, d) => sum + d.total, 0)) *
                  100
                ).toFixed(1);
                return (
                  <div
                    key={`detail-faculty-${idx}`}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="title-medium-primary">{item.faculty}</p>
                      <p className="body-medium-primary text-neutral-black">
                        {item.total} คน ({percentage}%)
                      </p>
                    </div>
                    <ChartContainer
                      config={detailChartConfig}
                      className="w-full h-[30px]"
                    >
                      <BarChart
                        data={[item]}
                        layout="vertical"
                        accessibilityLayer
                        margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
                      >
                        <CartesianGrid horizontal={false} vertical={false} />
                        <XAxis
                          type="number"
                          tickLine={false}
                          axisLine={false}
                          hide
                          domain={[0, mockMaxValue]}
                        />
                        <YAxis
                          dataKey="faculty"
                          type="category"
                          tickLine={false}
                          axisLine={false}
                          hide
                        />
                        {/* left stacked - unregistered */}
                        <Bar
                          dataKey="unregistered"
                          stackId="detail"
                          fill="var(--color-unregistered)"
                          radius={[2, 0, 0, 2]}
                          barSize={30}
                        >
                          <LabelList
                            dataKey="unregistered"
                            position="insideRight"
                            className="fill-neutral-white text-xs"
                          />
                        </Bar>
                        {/* right stacked - registered */}
                        <Bar
                          dataKey="registered"
                          stackId="detail"
                          fill="var(--color-registered)"
                          radius={[0, 2, 2, 0]}
                          barSize={30}
                        >
                          <LabelList
                            dataKey="registered"
                            position="insideRight"
                            className="fill-neutral-white text-xs"
                          />
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </div>
                );
              })}
              {/* Legend */}
              <div className="flex justify-center items-center space-x-8 mt-2">
                <div className="flex flex-row space-x-2 items-center">
                  <div className="w-4 h-4 bg-primary"></div>
                  <p className="label-small-primary">
                    {detailChartConfig.registered.label}
                  </p>
                </div>
                <div className="flex flex-row space-x-2 items-center">
                  <div className="w-4 h-4 bg-chart-pink-200"></div>
                  <p className="label-small-primary">
                    {detailChartConfig.unregistered.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
