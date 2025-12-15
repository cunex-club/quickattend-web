"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";

export const description = "A bar chart with a custom label";

type BarChartVerticalOverviewProps = {
  faculty: string;
  total: number;
};

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--color-primary)",
  },
  label: {
    color: "var(--color-neutral-black)",
  },
} satisfies ChartConfig;

export function BarChartVerticalOverview({ data }: { data: BarChartVerticalOverviewProps[] }) {
  const chartData = data;
  const BAR_SIZE: number = 32;
  const BAR_GAP: number = 48;
  const BAR_CHART_RADIUS: [number, number, number, number] = [2, 2, 2, 2];
  const LABEL_OFFSET: number = 8;
  const LABEL_FONT_SIZE: number = 14;
  const dinamicHeight: number = chartData.length * (BAR_SIZE + BAR_GAP) + 24;
  return (
    <Card className="bg-neutral-100 shadow-elevation-2 p-4  md:p-8">
      <CardContent>
        <ChartContainer
          config={chartConfig}
          style={{ maxHeight: `${dinamicHeight}px` }}
          className="w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} vertical={false} />
            <YAxis
              dataKey="faculty"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                typeof value === "string" ? value.slice(0, 3) : value
              }
              hide
            />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="total"
              layout="vertical"
              fill="transparent"
              radius={BAR_CHART_RADIUS}
              barSize={BAR_SIZE}
              tooltipType="none"
            >
              <LabelList
                dataKey="faculty"
                position="insideBottomLeft"
                offset={0}
                className="fill-[var(--color-label)] title-medium-primary md:title-large-primary -translate-y-[15px] md:-translate-y-[20px]"
              />
            </Bar>
            <Bar
              dataKey="total"
              layout="vertical"
              fill="var(--color-total)"
              radius={BAR_CHART_RADIUS}
              barSize={BAR_SIZE}
            >
              <LabelList
                dataKey="total"
                position="right"
                offset={LABEL_OFFSET}
                className="fill-foreground"
                fontSize={LABEL_FONT_SIZE}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
