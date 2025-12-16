"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardAction, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";
import Button from "@components/Button";
import type { BarChartHorizontalData } from "@customTypes/chart";

export const description = "A bar chart";

export type { BarChartHorizontalData };

type ChartDataPoint = {
  month: string;
  desktop: number;
};
interface BarChartHorizontalOverviewProps {
  data: ChartDataPoint[];
}

const chartConfig = {
  XAxis: {
    color: "var(--color-neutral-400)",
  },
  YAxis: {
    color: "var(--color-neutral-400)",
  },
  CartesianGrid: {
    color: "var(--color-neutral-200)",
  },
  desktop: {
    label: "Desktop",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export function BarChartHorizontalOverview({
  data,
}: {
  data: BarChartHorizontalOverviewProps[];
}) {
  const chartData = data;
  const [selectedFilter, setSelectedFilter] = useState<
    "student" | "staff" | null
  >(null);
  const BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0];
  const BAR_CATEGORY_GAP: number = 1;
  const STROKE_DASH_ARRAY: string = "3 3";
  const LABEL_OFFSET: number = 12;
  const LABEL_FONT_SIZE: number = 12;
  return (
    <Card className="py-0 px-0 h-full relative border-none shadow-none">
      <CardAction className="absolute z-10 right-0">
        <div className="space-x-4 bg-neutral-white">
          <Button
            mode={selectedFilter === "student" ? "filled" : "outline"}
            bordered="square"
            expanded={false}
            onClick={() =>
              setSelectedFilter(selectedFilter === "student" ? null : "student")
            }
          >
            <p className="label-large-emphasized -translate-y-0.5">นิสิต</p>
          </Button>
          <Button
            mode={selectedFilter === "staff" ? "filled" : "outline"}
            bordered="square"
            expanded={false}
            onClick={() =>
              setSelectedFilter(selectedFilter === "staff" ? null : "staff")
            }
          >
            <p className="label-large-emphasized -translate-y-0.5">บุคลากร</p>
          </Button>
        </div>
      </CardAction>

      <CardContent className="px-0 py-0 h-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            barCategoryGap={BAR_CATEGORY_GAP}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--color-CartesianGrid)"
              strokeDasharray={STROKE_DASH_ARRAY}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) => value.slice(0, 3)}
              stroke={"var(--color-XAxis)"}
            />
            <YAxis
              type="number"
              dataKey="desktop"
              tickLine={false}
              tickMargin={10}
              axisLine={true}
              stroke={"var(--color-YAxis)"}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Bar
              dataKey="desktop"
              fill="var(--color-desktop)"
              radius={BAR_RADIUS}
            >
              <LabelList
                dataKey="desktop"
                position="top"
                className="fill-neutral-black"
                offset={LABEL_OFFSET}
                fontSize={LABEL_FONT_SIZE}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
