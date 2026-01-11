"use client";

import { cn } from "@assets/lib/utils";
import { useState } from "react";
import { Pie, PieChart, Cell } from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";
import { DonutChartProps } from "@customTypes/chart";
import {
  useIsIpadPro,
  useIsMobile,
  useIsTablet,
} from "@assets/hooks/use-mobile";

// CONSTANTS

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-pink-500)",
  },
} satisfies ChartConfig;

const CHART_CONSTANTS = {
  RADIUS_DESKTOP_OUTER: 140,
  RADIUS_IPAD_PRO_OUTER: 130,
  RADIUS_TABLET_OUTER: 130,
  RADIUS_MOBILE_OUTER: 125,
  STROKE_WIDTH: 3,
  RING_GAP: 2,
  RING_THICKNESS: 5,
  START_ANGLE: 90,
  END_ANGLE: -270,
} as const;

// Component

export function PieChartStacked({ data }: { data: DonutChartProps[] }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isIpadPro = useIsIpadPro();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const outerRadius = isMobile
    ? CHART_CONSTANTS.RADIUS_MOBILE_OUTER
    : isIpadPro
      ? CHART_CONSTANTS.RADIUS_IPAD_PRO_OUTER
      : isTablet
        ? CHART_CONSTANTS.RADIUS_TABLET_OUTER
        : CHART_CONSTANTS.RADIUS_DESKTOP_OUTER;

  const chartDataInner = data.map((item, index) => ({
    ...item,
    fill: index === 0 ? "var(--color-primary)" : "var(--color-neutral-200)",
  }));

  const chartDataOuter = data.map((item, index) => ({
    ...item,
    fill: index === 0 ? "var(--color-pink-300)" : "var(--color-neutral-200)",
  }));

  const handleBackgroundClick = () => {
    setHoveredIndex(null);
    setIsLocked(false);
  };

  return (
    <Card className="flex flex-col py-12 sm:py-10 md:py-0 justify-center border-none shadow-none h-full">
      <CardContent className="pb-0" onClick={handleBackgroundClick}>
        <ChartContainer
          config={chartConfig}
          className={cn(
            "mx-auto h-full w-full p-4",
            "[\u0026_.recharts-surface]:overflow-visible"
          )}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="label-small-primary" />}
            />
            {/* inner pie */}
            <Pie
              data={chartDataInner}
              outerRadius={outerRadius}
              dataKey="total"
              nameKey="category"
              startAngle={CHART_CONSTANTS.START_ANGLE}
              endAngle={CHART_CONSTANTS.END_ANGLE}
              strokeWidth={CHART_CONSTANTS.STROKE_WIDTH}
              isAnimationActive={true}
            >
              {chartDataInner.map((entry, index) => {
                const opacity =
                  hoveredIndex !== null && hoveredIndex !== index ? 0.5 : 1;
                return (
                  <Cell
                    key={`cell-inner-${index}`}
                    onMouseEnter={() => !isLocked && setHoveredIndex(index)}
                    onMouseLeave={() => !isLocked && setHoveredIndex(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hoveredIndex === index && isLocked) {
                        setIsLocked(false);
                        setHoveredIndex(null);
                      } else {
                        setHoveredIndex(index);
                        setIsLocked(true);
                      }
                    }}
                    style={{
                      cursor: "pointer",
                      opacity: opacity,
                      transition: "opacity 0.3s ease-in-out",
                      outline: "none",
                    }}
                  />
                );
              })}
            </Pie>
            {/* outer ring (highlight) */}
            <Pie
              data={chartDataOuter}
              dataKey="total"
              nameKey="category"
              innerRadius={outerRadius + CHART_CONSTANTS.RING_GAP}
              outerRadius={
                outerRadius +
                CHART_CONSTANTS.RING_GAP +
                CHART_CONSTANTS.RING_THICKNESS
              }
              startAngle={CHART_CONSTANTS.START_ANGLE}
              endAngle={CHART_CONSTANTS.END_ANGLE}
              isAnimationActive={true}
            >
              {chartDataOuter.map((entry, index) => (
                <Cell
                  key={`cell-outer-${index}`}
                  fillOpacity={hoveredIndex === index ? 0.5 : 0}
                  style={{
                    transition: "fill-opacity 0.3s ease-in-out",
                    pointerEvents: "none",
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
