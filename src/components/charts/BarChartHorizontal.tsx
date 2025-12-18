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

export const description = "A bar chart with a label";

type BarChartHorizontalProps = {
  time: string;
  total: number;
};

const chartConfig = {
  total: {
    label: "total",
    color: "var(--color-primary)",
  },
  XAxis: {
    color: "var(--color-neutral-400)",
  },
  YAxis: {
    color: "var(--color-neutral-400)",
  },
  CartesianGrid: {
    color: "var(--color-neutral-300)",
  },
} satisfies ChartConfig;

export function BarChartHorizontal({
  data,
}: {
  data: BarChartHorizontalProps[];
}) {
  const BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0];
  const BAR_CATEGORY_GAP: number = 1;
  const LABEL_OFFSET: number = 12;
  const LABEL_FONT_SIZE: number = 12;

  return (
    <Card className="p-0 border-none shadow-none">
      <CardContent className="px-0">
        <ChartContainer
          config={chartConfig}
          className="max-h-[300px] lg:max-h-[400px] w-full pr-3 chart-hover-bar"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
            barCategoryGap={BAR_CATEGORY_GAP}
          >
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="var(--color-CartesianGrid)"
              strokeWidth={0.4}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="time"
              tickLine={false}
              tickMargin={10}
              axisLine={true}
              stroke={"var(--color-XAxis)"}
              className="hidden md:block"
            />
            <YAxis
              type="number"
              dataKey="total"
              tickLine={false}
              tickMargin={10}
              axisLine={true}
              stroke={"var(--color-YAxis)"}
            />

            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="total"
              fill="var(--color-total)"
              radius={BAR_RADIUS}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                />
              ))}
              <LabelList
                position="top"
                offset={LABEL_OFFSET}
                className="fill-neutral-black"
                fontSize={LABEL_FONT_SIZE}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
