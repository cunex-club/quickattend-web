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
import {
  BarChartVerticalStackedProps,
  TimeDetailData,
} from "@customTypes/chart";
import { cn } from "@assets/lib/utils";
import IonIcon from "@shared/IonIcon";

const DETAIL_CHART_CONSTANTS = {
  BAR_RADIUS: [8, 8, 0, 0] as [number, number, number, number],
  WIDTH_PER_BAR_DESKTOP: 180,
  WIDTH_PER_BAR_TABLET: 110,
  WIDTH_PER_BAR_MOBILE: 120,
} as const;

const getDetailChartWidth = (
  dataLength: number,
  isMobile: boolean,
  isTablet: boolean,
): number => {
  if (isMobile) return dataLength * DETAIL_CHART_CONSTANTS.WIDTH_PER_BAR_MOBILE;
  if (isTablet) return dataLength * DETAIL_CHART_CONSTANTS.WIDTH_PER_BAR_TABLET;
  return dataLength * DETAIL_CHART_CONSTANTS.WIDTH_PER_BAR_DESKTOP;
};

export function BarChartVerticalStacked({
  data,
  timeDetailData,
}: {
  data: BarChartVerticalStackedProps[];
  timeDetailData?: Record<string, TimeDetailData[]>;
}) {
  const t = useTranslations("Charts");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const chartConfig = {
    unregistered: {
      label: t("notRegistered"),
      color: "var(--chart-pink-200)",
    },
    registered: {
      label: t("registered"),
      color: "var(--color-primary)",
    },
  } satisfies ChartConfig;

  const LEFT_BAR_BORDER_RADIUS: [number, number, number, number] = [2, 0, 0, 2];
  const RIGHT_BAR_BORDER_RADIUS: [number, number, number, number] = [
    0, 2, 2, 0,
  ];

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  let BAR_SIZE: number = 30;
  if (isMobile) {
    BAR_SIZE = 20;
  } else if (isTablet) {
    BAR_SIZE = 28;
  }

  const maxDataValue = Math.max(
    ...data.map((d) => d.registered + d.unregistered),
  );
  const xDomainMax = (maxDataValue || 0) * 1.15;

  const totalSum = data.reduce(
    (sum, item) => sum + item.registered + item.unregistered,
    0,
  );
  const chartDataWithMeta = data.map((item) => {
    const total = item.registered + item.unregistered;
    return {
      ...item,
      total,
      percentage: totalSum > 0 ? ((total / totalSum) * 100).toFixed(1) : "0",
    };
  });

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

  // Get fill colors based on hover/selection state
  const getBarColors = (idx: number) => {
    if (hoveredIndex === null) {
      return {
        unregistered: "var(--color-unregistered)",
        registered: "var(--color-registered)",
      };
    }
    if (hoveredIndex === idx) {
      return {
        unregistered: "var(--color-unregistered)",
        registered: "var(--color-registered)",
      };
    }
    // Non-selected bars get neutral colors
    return {
      unregistered: "var(--color-neutral-300)",
      registered: "var(--color-neutral-400)",
    };
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
          className="mr-2 mb-10 max-h-[280px] md:max-h-[350px] lg:max-h-[400px] xl:max-h-[470px] overflow-auto pb-2"
          onClick={handleBackgroundClick}
        >
          <div className="flex flex-col space-y-4">
            {chartDataWithMeta.map((item, idx) => {
              const barColors = getBarColors(idx);
              return (
                <div
                  key={`faculty-stacked-${idx}`}
                  className="chart-item flex flex-col space-y-2 cursor-pointer"
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
                    className="w-full cursor-pointer"
                    style={{
                      height: `${BAR_SIZE}px`,
                      maxHeight: `${BAR_SIZE}px`,
                    }}
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
                        domain={[0, xDomainMax]}
                      />
                      <YAxis
                        dataKey="faculty"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        hide
                      />

                      {/* left stacked */}
                      <Bar
                        dataKey="unregistered"
                        stackId="a"
                        fill={barColors.unregistered}
                        radius={LEFT_BAR_BORDER_RADIUS}
                        barSize={BAR_SIZE}
                        style={{ transition: "fill 0.3s ease-in-out" }}
                        isAnimationActive={false}
                        className="transition-all duration-300 ease-in-out cursor-pointer"
                      >
                        <LabelList
                          dataKey="unregistered"
                          position="insideRight"
                          className="fill-neutral-white text-xs"
                        />
                      </Bar>
                      {/* right stacked */}
                      <Bar
                        dataKey="registered"
                        stackId="a"
                        fill={barColors.registered}
                        radius={RIGHT_BAR_BORDER_RADIUS}
                        barSize={BAR_SIZE}
                        style={{ transition: "fill 0.3s ease-in-out" }}
                        isAnimationActive={false}
                        className="transition-all duration-300 ease-in-out cursor-pointer"
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
          </div>
        </CardContent>
        <div className="w-full flex justify-center">
          <div className="flex justify-center items-center space-x-8 md:space-x-16">
            <div className="flex flex-row space-x-2 items-center">
              <div className="w-4 h-4 bg-primary"></div>
              <p className="label-small-primary">
                {chartConfig.registered.label}
              </p>
            </div>
            <div className="flex flex-row space-x-2 items-center">
              <div className="w-4 h-4 bg-chart-pink-200"></div>
              <p className="label-small-primary">
                {chartConfig.unregistered.label}
              </p>
            </div>
          </div>
        </div>
      </Card>
      {/* Selected item detail section */}
      <div
        className={cn(
          "rounded-xl transition-all duration-300 ease-in-out",
          selectedItem && isLocked
            ? "opacity-100 h-[510px] max-h-full"
            : "opacity-0 h-0 py-0 mt-0",
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
