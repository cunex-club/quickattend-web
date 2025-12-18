"use client";
import { cn } from "@assets/lib/utils";
import * as React from "react";
import { Label, Pie, PieChart, Cell } from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";

export const description = "A donut chart with text";

type DonutChartProps = {
  category: string;
  total: number;
};

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-pink-500)",
  },
} satisfies ChartConfig;

export function DonutChart({ data }: { data: DonutChartProps[] }) {
  const chartData = React.useMemo(
    () => data.map((item, index) => ({
      ...item,
      fill: index === 0 ? "var(--color-primary)" : "var(--color-gray-300)",
    })),
    [data]
  );

  const registeredPercent = React.useMemo(() => {
    const total = chartData.reduce((acc, curr) => acc + curr.total, 0);
    const registered = chartData[0].total;
    return ((registered / total) * 100).toFixed(0);
  }, [chartData]);

  interface LabelProps {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    payload?: { category?: string; total?: number };
    percent?: number;
  }


  const customLabel = React.useMemo(() => {
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
  }, []);

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

            {/* Mobile version - largest radius, no labels */}
            <Pie
              className="md:hidden"
              data={chartData}
              dataKey="total"
              nameKey="category"
              innerRadius={70}
              outerRadius={125}
              strokeWidth={3}
              startAngle={90}
              endAngle={-270}
              label={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-mobile-${index}`}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="headline-large-emphasized -translate-y-2.5"
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

            {/* Tablet version - medium radius, no labels */}
            <Pie
              className="hidden md:block lg:hidden"
              data={chartData}
              dataKey="total"
              nameKey="category"
              innerRadius={100}
              outerRadius={180}
              strokeWidth={3}
              startAngle={90}
              endAngle={-270}
              label={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-tablet-${index}`}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="headline-large-emphasized -translate-y-2"
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

            {/* Desktop version - normal radius, with custom labels */}
            <Pie
              className="hidden lg:block"
              data={chartData}
              dataKey="total"
              nameKey="category"
              innerRadius={110}
              outerRadius={170}
              strokeWidth={3}
              startAngle={90}
              endAngle={-270}
              labelLine={{ strokeWidth: 2 }}
              label={customLabel}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-desktop-${index}`}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="headline-large-emphasized -translate-y-2"
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
