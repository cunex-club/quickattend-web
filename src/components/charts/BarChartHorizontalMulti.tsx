"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  LabelList,
  YAxis,
  Cell,
} from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@assets/components/ui/chart";

export const description = "A multiple bar chart";

const chartData = [
  {
    month: "January",
    desktop: 186,
    mobile: 80,
    ipad: 50,
    macbook: 120,
    tablet: 60,
  },
  {
    month: "February",
    desktop: 305,
    mobile: 200,
    ipad: 100,
    macbook: 150,
    tablet: 90,
  },
  {
    month: "March",
    desktop: 237,
    mobile: 120,
    ipad: 80,
    macbook: 130,
    tablet: 70,
  },
  {
    month: "April",
    desktop: 73,
    mobile: 190,
    ipad: 60,
    macbook: 90,
    tablet: 50,
  },
  {
    month: "May",
    desktop: 209,
    mobile: 130,
    ipad: 90,
    macbook: 110,
    tablet: 80,
  },
  {
    month: "June",
    desktop: 214,
    mobile: 140,
    ipad: 70,
    macbook: 140,
    tablet: 90,
  },
  {
    month: "July",
    desktop: 180,
    mobile: 160,
    ipad: 75,
    macbook: 125,
    tablet: 65,
  },
  {
    month: "August",
    desktop: 220,
    mobile: 150,
    ipad: 85,
    macbook: 135,
    tablet: 75,
  },
];

const chartConfig = {
  XAxis: {
    color: "var(--color-neutral-400)",
  },
  YAxis: {
    color: "var(--color-neutral-400)",
  },
  desktop: {
    label: "Desktop",
    color: "var(--color-chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-chart-2)",
  },
  ipad: {
    label: "iPad",
    color: "var(--color-chart-3)",
  },
  macbook: {
    label: "MacBook",
    color: "var(--color-chart-4)",
  },
  tablet: {
    label: "Tablet",
    color: "var(--color-chart-5)",
  },
  CartesianGrid: {
    color: "var(--color-gray-300)",
  },
} satisfies ChartConfig;

export function BarChartHorizontalMulti() {
  const BAR_SPACING = 0;
  const BAR_RADIUS = 2;
  const LABEL_OFFSET: number = 8;
  const LABEL_FONT_SIZE: number = 14;
  const STROKE_DASH_ARRAY: string = "3 3";

  return (
    <Card className="px-0 border-none shadow-none">
      <CardContent className="px-0">
        <div className="min-w-[1000px] sm:min-w-[2000px] md:min-w-[1500px] lg:min-w-[1300px] w-full">
          <ChartContainer
            config={chartConfig}
            className="w-full pr-3 max-h-[250px] md:max-h-[450px] chart-hover-bar"
          >
            <BarChart accessibilityLayer data={chartData} barGap={BAR_SPACING}>
              <CartesianGrid
                horizontal={true}
                vertical={false}
                stroke="var(--color-gray-300)"
                strokeWidth={0.4}
                strokeDasharray={STROKE_DASH_ARRAY}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={true}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                type="number"
                tickLine={false}
                axisLine={true}
                tickFormatter={(value) => value.toString()}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              {["desktop", "mobile", "ipad", "macbook", "tablet"].map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={`var(--color-${key})`}
                  radius={BAR_RADIUS}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${key}-${index}`} />
                  ))}
                  <LabelList
                    dataKey={key}
                    position="top"
                    offset={LABEL_OFFSET}
                    className="fill-foreground hidden md:block"
                    fontSize={LABEL_FONT_SIZE}
                  />
                </Bar>
              ))}
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
