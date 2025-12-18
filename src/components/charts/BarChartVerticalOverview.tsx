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
import type { BarChartVerticalData } from "@customTypes/chart";

export const description = "A bar chart with a custom label";
export type { BarChartVerticalData };
interface BarChartVerticalOverviewProps {
  data: BarChartVerticalData[];
}

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--color-primary)",
  },
  label: {
    color: "var(--color-neutral-black)",
  },
} satisfies ChartConfig;

export function BarChartVerticalOverview({
  data,
}: BarChartVerticalOverviewProps) {
  const chartData = data;
  const BAR_SIZE: number = 32;
  const BAR_GAP: number = 1;
  const BAR_CHART_RADIUS: [number, number, number, number] = [2, 2, 2, 2];
  const LABEL_OFFSET: number = 8;
  const LABEL_FONT_SIZE: number = 14;
  
  // Calculate total sum for percentage calculation
  const totalSum = chartData.reduce((sum, item) => sum + item.total, 0);
  
  // Add percentage to chart data
  const chartDataWithPercentage = chartData.map(item => ({
    ...item,
    percentage: totalSum > 0 ? ((item.total / totalSum) * 100).toFixed(1) : "0",
    facultyWithPercentage: `${item.faculty} (${totalSum > 0 ? ((item.total / totalSum) * 100).toFixed(1) : "0"}%)`
  }));
  
  // Calculate dynamic height: (bars × barSize) + (gaps between bars) + padding
  const dynamicHeight: number = 
    chartData.length * BAR_SIZE + 
    (chartData.length - 1) * BAR_GAP;
  return (
    <Card className="bg-neutral-white md:bg-neutral-100 shadow-none md:shadow-elevation-2 p-4 md:p-8 border-none">
      <CardContent className="shadow-none border-none">
        <ChartContainer
          config={chartConfig}
          style={{ minHeight: `${dynamicHeight}px` }}
          className="w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartDataWithPercentage}
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
            {/* Faculty Names */}
            <Bar
              dataKey="total"
              layout="vertical"
              fill="transparent"
              radius={BAR_CHART_RADIUS}
              barSize={BAR_SIZE}
              tooltipType="none"
            >
              <LabelList
                dataKey="facultyWithPercentage"
                position="insideBottomLeft"
                offset={0}
                className="fill-[var(--color-label)] title-medium-primary md:title-large-primary -translate-y-[15px] md:-translate-y-[20px]"
              />
            </Bar>
            {/* Total Values */}
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
