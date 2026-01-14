"use client";
import { cn } from "@assets/lib/utils";
import { useCallback, useMemo } from "react";
import { Pie, PieChart, Cell } from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";

export const description = "A pie chart with a label";

const chartData = [
  { faculty: "คณะวิศวกรรมศาสตร์", total: 232 },
  { faculty: "คณะวิทยาศาสตร์", total: 131 },
  { faculty: "คณะมนุษยศาสตร์", total: 223 },
  { faculty: "คณะบริหารธุรกิจ", total: 121 },
  { faculty: "อื่นๆ", total: 153 },
];

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const chartConfig = {} satisfies ChartConfig;

// Component

export function PieChartWithLabel() {
  // Memoize chart total to avoid recalculating on every label render
  const chartTotal = useMemo(
    () => chartData.reduce((sum, it) => sum + Number(it?.total ?? 0), 0),
    []
  );

  type PieLabelProps = {
    cx?: number | string;
    cy?: number | string;
    midAngle?: number;
    innerRadius?: number | string;
    outerRadius?: number | string;
    payload?: { faculty?: string; total?: number } | undefined;
  };

  // this function is adapted from Recharts' example: https://recharts.org/en-US/examples/CustomizedLabelPieChart
  const customLabel = useCallback(
    (props: unknown) => {
      const CUSTOM_DISTANCE: number = 1.25;
      const RADIAN = Math.PI / 180;
      const { cx, cy, midAngle, innerRadius, outerRadius, payload } =
        (props as PieLabelProps) || {};

      const inner = Number(innerRadius ?? 0);
      const outer = Number(outerRadius ?? 0);
      const m = Number(midAngle ?? 0);
      const centerX = Number(cx ?? 0);
      const centerY = Number(cy ?? 0);

      const radius: number = inner + (outer - inner) * CUSTOM_DISTANCE;
      const x = centerX + radius * Math.cos(-m * RADIAN);
      const y = centerY + radius * Math.sin(-m * RADIAN);

      const name = payload?.faculty ?? "";
      const total = Number(payload?.total ?? 0);

      const percent = ((total / (chartTotal || 1)) * 100).toFixed(0);

      // anchor left/right depending on which side of the center the label sits
      const anchor = x > Number(cx ?? 0) ? "start" : "end";

      return (
        <text
          x={x}
          y={y}
          textAnchor={anchor}
          dominantBaseline="central"
          className="body-small-primary md:body-large-primary"
        >
          <tspan x={x}>{name}</tspan>
          <tspan x={x} dy="1.1em">
            {total} ({percent}%)
          </tspan>
        </text>
      );
    },
    [chartTotal]
  );

  return (
    <Card className="flex flex-col justify-center h-full w-full border-none shadow-none">
      <CardContent className="pb-0 h-full">
        <ChartContainer
          config={chartConfig}
          className={cn(
            "mx-auto aspect-square max-h-[300px] pb-0 flex flex-col justify-center h-full w-full",
            "[&_.recharts-pie-label-text]:fill-foreground",
            "[&_.recharts-surface]:overflow-visible",
            "chart-hover-pie"
          )}
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="total"
              label={customLabel}
              nameKey="faculty"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
