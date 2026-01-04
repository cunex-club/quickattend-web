"use client";

import { cn } from "@assets/lib/utils";
import { Pie, PieChart, Cell } from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";
import { PieChartStackedProps } from "@customTypes/chart";

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-pink-500)",
  },
} satisfies ChartConfig;

export function PieChartStacked({ data }: { data: PieChartStackedProps[] }) {
  const chartDataInner = data.map((item, index) => ({
    ...item,
    fill: index === 0 ? "var(--color-primary)" : "var(--color-gray-100)",
  }));

  const chartDataOuter = data.map((item, index) => ({
    ...item,
    fill: index === 0 ? "var(--color-pink-200)" : "var(--color-neutral-white)",
  }));

  return (
    <Card className="flex flex-col justify-center h-full w-full border shadow-none">
      <CardContent className="pb-0 h-full flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className={cn(
            "mx-auto aspect-square max-h-[300px] max-w-[300px] h-full w-full",
            "[\u0026_.recharts-surface]:overflow-visible",
            "chart-hover-pie"
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
              outerRadius={140}
              dataKey="total"
              nameKey="category"
              startAngle={90}
              endAngle={-270}
              strokeWidth={3}
            >
              {chartDataInner.map((entry, index) => (
                <Cell key={`cell-inner-${index}`} />
              ))}
            </Pie>
            {/* outer ring */}
            <Pie
              data={chartDataOuter}
              dataKey="total"
              startAngle={90}
              endAngle={-270}
              innerRadius={142}
              outerRadius={149}
              tooltipType="none"
              strokeWidth={3}
            >
              {chartDataOuter.map((entry, index) => (
                <Cell key={`cell-outer-${index}`} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
