"use client";

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

export const description = "A bar chart with a custom label";

type BarChartVerticalProps = {
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

export function BarChartVertical({ data }: { data: BarChartVerticalProps[] }) {
  const chartData = data;
  const BAR_SIZE: number = 32;
  const BAR_GAP: number = 48;
  const BAR_CHART_RADIUS: [number, number, number, number] = [2, 2, 2, 2];
  const LABEL_OFFSET: number = 8;
  const LABEL_FONT_SIZE: number = 14;
  const dynamicHeight: number = chartData.length * (BAR_SIZE + BAR_GAP);

  return (
    <Card className="bg-neutral-100 shadow-elevation-2 h-auto w-full px-0 lg:px-8">
      <CardContent className="px-0">
        <ChartContainer
          config={chartConfig}
          className="w-full chart-hover-bar"
          style={{ height: `${dynamicHeight}px` }}
        >
          <BarChart
            data={chartData}
            layout="vertical"
            accessibilityLayer
            margin={{ left: 40, right: 20 }}
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
                className="fill-[var(--color-label)] font-var(--font-chula-regular) text-[22px] leading-[28px] tracking-[0px] -translate-y-[10px]"
              />
            </Bar>

            <Bar
              dataKey="total"
              layout="vertical"
              fill="var(--color-total)"
              radius={BAR_CHART_RADIUS}
              barSize={BAR_SIZE}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                />
              ))}
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
