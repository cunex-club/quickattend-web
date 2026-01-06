"use client";
import { cn } from "@assets/lib/utils";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";
import { DonutChartProps } from "@customTypes/chart";
import { useIsMobile, useIsTablet } from "@assets/hooks/use-mobile";

// CONSTANTS

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-pink-500)",
  },
} satisfies ChartConfig;

// Component

export function DonutChart({ data }: { data: DonutChartProps[] }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const chartData = data.map((item, index) => ({
    ...item,
    fill: index === 0 ? "var(--color-primary)" : "var(--color-gray-300)",
  }));

  const registeredPercent = (() => {
    const total = chartData.reduce((acc, curr) => acc + curr.total, 0);
    const registered = chartData[0].total;
    return ((registered / total) * 100).toFixed(0);
  })();

  // Responsive sizing based on breakpoints
  let innerRadius = 110;
  let outerRadius = 170;
  let showLabels = true;

  if (isMobile) {
    innerRadius = 70;
    outerRadius = 125;
    showLabels = false;
  } else if (isTablet) {
    innerRadius = 100;
    outerRadius = 180;
    showLabels = false;
  }

  interface LabelProps {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    payload?: { category?: string; total?: number };
    percent?: number;
  }

  const customLabel = (() => {
    const LabelComponent = (props: LabelProps) => {
      const CUSTOM_DISTANCE = 1.6;
      const RADIAN = Math.PI / 180;
      const { cx, cy, midAngle, innerRadius, outerRadius, payload, percent } =
        props;

      const radius: number =
        Number(innerRadius ?? 0) +
        (Number(outerRadius ?? 0) - Number(innerRadius ?? 0)) * CUSTOM_DISTANCE;
      const x = Number(cx ?? 0) + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
      const y = Number(cy ?? 0) + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

      const name = payload?.category ?? "";
      const value = payload?.total ?? "";
      const pct = `${(Number(percent ?? 0) * 100).toFixed(0)}%`;

      const anchor = x > Number(cx ?? 0) ? "start" : "end";

      return (
        <text
          x={x}
          y={y}
          textAnchor={anchor}
          dominantBaseline="central"
          className="recharts-pie-label-text"
        >
          <tspan x={x} className="label-large-primary">
            {name}
          </tspan>
          <tspan x={x} dy="1.5em" className="label-small-primary">
            {value} คน ({pct})
          </tspan>
        </text>
      );
    };
    LabelComponent.displayName = "DonutChartLabel";
    return LabelComponent;
  })();

  return (
    <Card className="flex flex-col py-12 sm:py-10 md:py-0 justify-center border-none shadow-none h-full">
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className={cn(
            "mx-auto h-full w-full p-4",
            "[&_.recharts-surface]:overflow-visible",
            "[&_.recharts-pie-label-line]:stroke-[var(--color-gray-300)]",
            "[&_.recharts-pie-label-text]:fill-[var(--color-primary)]",
            "chart-hover-pie"
          )}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="label-small-primary" />}
            />

            <Pie
              data={chartData}
              dataKey="total"
              nameKey="category"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              strokeWidth={3}
              startAngle={90}
              endAngle={-270}
              labelLine={showLabels ? { strokeWidth: 2 } : false}
              label={showLabels ? customLabel : false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={cn(
                          "headline-large-emphasized",
                          showLabels && "-translate-y-2"
                        )}
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-primary"
                        >
                          {registeredPercent.toLocaleString()}%
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
