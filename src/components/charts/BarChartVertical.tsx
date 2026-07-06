"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";

import { ChartConfig, ChartContainer } from "@assets/components/ui/chart";
import { useIsMobile, useIsTablet } from "@assets/hooks/use-mobile";
import { BarChartVerticalProps, TimeDetailData } from "@customTypes/chart";
import { cn } from "@assets/lib/utils";
import IonIcon from "@shared/IonIcon";

// CONSTANTS

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--color-primary)",
  },
  label: {
    color: "var(--color-neutral-black)",
  },
} satisfies ChartConfig;

const BAR_CONSTANTS = {
  RADIUS: [2, 2, 2, 2] as [number, number, number, number],
  LABEL_OFFSET: 8,
  LABEL_FONT_SIZE: 14,
  SIZE: 28,
  DOMAIN_MULTIPLIER: 1.15,
} as const;

const DETAIL_CHART_CONSTANTS = {
  BAR_RADIUS: [8, 8, 0, 0] as [number, number, number, number],
  WIDTH_PER_BAR_DESKTOP: 180,
  WIDTH_PER_BAR_TABLET: 110,
  WIDTH_PER_BAR_MOBILE: 120,
} as const;

// HELPER FUNCTIONS

const calculateXDomain = (data: BarChartVerticalProps[]): number => {
  const maxValue = Math.max(...data.map((d) => d.total));
  return (maxValue || 0) * BAR_CONSTANTS.DOMAIN_MULTIPLIER;
};

const addPercentageMetadata = (data: BarChartVerticalProps[]) => {
  const totalSum = data.reduce((sum, item) => sum + item.total, 0);
  return data.map((item) => ({
    ...item,
    percentage: totalSum > 0 ? ((item.total / totalSum) * 100).toFixed(1) : "0",
  }));
};

const getDetailChartWidth = (
  dataLength: number,
  isMobile: boolean,
  isTablet: boolean,
): number => {
  if (isMobile) return dataLength * DETAIL_CHART_CONSTANTS.WIDTH_PER_BAR_MOBILE;
  if (isTablet) return dataLength * DETAIL_CHART_CONSTANTS.WIDTH_PER_BAR_TABLET;
  return dataLength * DETAIL_CHART_CONSTANTS.WIDTH_PER_BAR_DESKTOP;
};

// Component

export function BarChartVertical({
  data,
  timeDetailData,
}: {
  data: BarChartVerticalProps[];
  timeDetailData?: Record<string, TimeDetailData[]>;
}) {
  const t = useTranslations("Charts");
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const xDomainMax = calculateXDomain(data);
  const chartDataWithMeta = addPercentageMetadata(data);

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

  // Get fill color based on hover/selection state
  const getBarColor = (idx: number) => {
    if (hoveredIndex === null) {
      return "var(--color-primary)";
    }
    if (hoveredIndex === idx) {
      return "var(--color-primary)";
    }
    // Non-selected bars get neutral color
    return "var(--color-neutral-400)";
  };

  const selectedItem =
    hoveredIndex !== null ? chartDataWithMeta[hoveredIndex] : null;

  // Get time detail data for selected faculty
  const currentTimeData =
    selectedItem && timeDetailData
      ? timeDetailData[selectedItem.faculty] || []
      : [];

  const detailChartWidth = getDetailChartWidth(
    currentTimeData.length,
    isMobile,
    isTablet,
  );

  return (
    <div>
      <Card className="bg-neutral-white lg:bg-neutral-100 border-none shadow-none lg:py-8 pl-0 lg:pl-8 lg:pr-6 rounded-[28px] w-full">
        <CardContent
          className="mr-2 max-h-[470px] overflow-auto"
          onClick={handleBackgroundClick}
        >
          <div className="flex flex-col space-y-4">
            {chartDataWithMeta.map((item, idx) => {
              const barColor = getBarColor(idx);
              return (
                <div
                  key={`faculty-chart-${idx}`}
                  className="chart-item flex flex-col space-y-3 md:space-y-5 lg:space-y-4 cursor-pointer"
                  onMouseEnter={() => !isLocked && setHoveredIndex(idx)}
                  onMouseLeave={() => !isLocked && setHoveredIndex(null)}
                  onClick={(e) => handleBarClick(idx, e)}
                >
                  <div className="flex items-center justify-between">
                    <p className="title-medium-primary md:title-large-primary">
                      {item.faculty}
                    </p>
                    <p className="body-medium-primary md:body-large-primary text-neutral-black">
                      {item.total} {t("unit")} ({item.percentage}%)
                    </p>
                  </div>
                  <ChartContainer
                    config={chartConfig}
                    style={{ height: `${BAR_CONSTANTS.SIZE}px` }}
                    className="w-full cursor-pointer"
                  >
                    <BarChart
                      accessibilityLayer
                      data={[item]}
                      layout="vertical"
                      margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
                    >
                      <CartesianGrid horizontal={false} vertical={false} />
                      <YAxis
                        dataKey="faculty"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        hide
                      />
                      <XAxis
                        dataKey="total"
                        type="number"
                        hide
                        domain={[0, xDomainMax]}
                      />
                      <Bar
                        dataKey="total"
                        layout="vertical"
                        fill={barColor}
                        radius={BAR_CONSTANTS.RADIUS}
                        barSize={BAR_CONSTANTS.SIZE}
                        style={{ transition: "fill 0.3s ease-in-out" }}
                        isAnimationActive={false}
                        className="transition-all duration-300 ease-in-out cursor-pointer"
                      >
                        <LabelList
                          dataKey="total"
                          position="right"
                          offset={BAR_CONSTANTS.LABEL_OFFSET}
                          className="fill-foreground"
                          fontSize={BAR_CONSTANTS.LABEL_FONT_SIZE}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected item detail section */}
      <div
        className={cn(
          "rounded-xl transition-all duration-300 ease-in-out",
          selectedItem && isLocked
            ? "opacity-100 h-[520px] max-h-full"
            : "opacity-0 h-0",
        )}
      >
        {selectedItem && isLocked && (
          <div className="flex flex-col h-full p-10 px-0 md:px-10 lg:px-16 xl:px-32 space-y-6">
            <div className="flex flex-row space-x-2 items-center">
              <IonIcon
                name="BusinessSharp"
                size="16px"
                className="text-primary"
              />
              <p className="body-medium-primary">{selectedItem.faculty}</p>
            </div>
            <div className="w-full overflow-x-auto">
              <ChartContainer
                config={{
                  total: {
                    label: t("totalParticipants"),
                    color: "var(--color-primary)",
                  },
                }}
                className="h-[300px] md:h-[350px] w-full pr-3"
                style={{ minWidth: `${detailChartWidth}px` }}
              >
                <BarChart
                  data={currentTimeData}
                  accessibilityLayer
                  margin={{ left: 0, right: 0, top: 16, bottom: 0 }}
                >
                  <CartesianGrid
                    horizontal={true}
                    vertical={false}
                    stroke="var(--color-neutral-300)"
                    strokeWidth={0.4}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis
                    type="number"
                    dataKey="total"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    fontSize={12}
                    width={30}
                  />
                  <Bar
                    dataKey="total"
                    fill="var(--color-primary)"
                    radius={DETAIL_CHART_CONSTANTS.BAR_RADIUS}
                  >
                    <LabelList
                      position="top"
                      offset={4}
                      className="fill-neutral-black"
                      fontSize={10}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
