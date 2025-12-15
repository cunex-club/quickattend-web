"use client";
import { cn } from "@assets/lib/utils";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";
import { useEffect, useState } from "react";

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

export function DonutChart({data}: {data: DonutChartProps[]}) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const chartData = data.map((item, index) => ({
    ...item,
    fill: index === 0 ? "var(--color-primary)" : "var(--color-gray-300)",
  }));
  // we cannot directly adjust the donut size by using width and height of PieChart
  // so we use innerRadius and outerRadius to adjust the size instead
  const [radius, setRadius] = useState({ inner: "40%", outer: "70%" });
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 768);
    if (window.innerWidth < 768) {
      setRadius({ inner: "80%", outer: "120%" });
    } else {
      setRadius({ inner: "50%", outer: "80%" });
    }
  };

  const registeredPercent = React.useMemo(() => {
    const total = chartData.reduce((acc, curr) => acc + curr.total, 0);
    const registered = chartData[0].total;
    return ((registered / total) * 100).toFixed(0);
  }, []);

  const customLabel = (props: any) => {
    const CUSTOM_DISTANCE = 1.6;
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, payload, percent } =
      props as any;

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

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card className="flex flex-col py-4 md:py-0 justify-center border-none">
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className={cn(
            "mx-auto aspect-square max-h-[200px] md:max-h-[400px] p-4",
            "[&_.recharts-surface]:overflow-visible",
            "[&_.recharts-pie-label-line]:stroke-[var(--color-gray-300)]",
            "[&_.recharts-pie-label-text]:fill-[var(--color-primary)]",
            // "[&_.recharts-pie-label-text]:font-family-[var(--font-chula-regular)]", // this not working
            // "[&_.recharts-pie-label-text]:font-size-[12px]",
            // "[&_.recharts-pie-label-text]:line-height-[16px]",
            // "[&_.recharts-pie-label-text]:letter-spacing-[0.5px]"
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
              innerRadius={radius.inner}
              outerRadius={radius.outer}
              strokeWidth={3}
              startAngle={90}
              endAngle={-270}
              labelLine={{ strokeWidth: 2 }}
              label={isSmallScreen ? false : customLabel}
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
                        className="headline-large-emphasized -translate-y-2.5 md:-translate-y-2"
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
