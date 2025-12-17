"use client";

import {
  Bar,
  BarChart,
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
  ChartLegend,
  ChartLegendContent,
} from "@assets/components/ui/chart";

export const description = "A multiple bar chart";

const chartData = [
  { faculty: "คณะวิศวกรรมศาสตร์", desktop: 186, mobile: 80, ipad: 50 },
  { faculty: "คณะอักษรศาสตร์", desktop: 305, mobile: 200, ipad: 100 },
  { faculty: "คณะวิทยาศาสตร์", desktop: 237, mobile: 120, ipad: 80 },
  { faculty: "คณะรัฐศาสตร์", desktop: 73, mobile: 190, ipad: 60 },
  { faculty: "คณะสถาปัตยกรรมศาสตร์", desktop: 209, mobile: 130, ipad: 90 },
];

const chartConfig = {
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
} satisfies ChartConfig;

export function BarChartVerticalMulti() {
  const BAR_SIZE: number = 32;
  const BAR_GAP: number = 16*chartData.length;
  const BAR_RADIUS: number = 2;
  const LABEL_OFFSET: number = 8;
  const LABEL_FONT_SIZE: number = 16;
  const BAR_GAP_WITHIN_GROUP: number = 1;
  const BAR_CATEGORY_GAP: number = 32;
  const dynamicHeight: number = chartData.length * (BAR_SIZE + BAR_GAP + BAR_CATEGORY_GAP);
    
  return (
    <Card className="bg-neutral-100 shadow-elevation-2">
      <CardContent className="overflow-visible mx-0 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-48 py-6 md:py-8">
        <ChartContainer 
          config={chartConfig} 
          className="overflow-visible w-full"
          style={{ height: `${dynamicHeight}px` }}
        >
          <BarChart 
            accessibilityLayer 
            data={chartData} 
            layout="vertical"
            margin={{ left: 20 }}
            barGap={BAR_GAP_WITHIN_GROUP}
            barCategoryGap={BAR_CATEGORY_GAP}
          >
            <ChartLegend content={<ChartLegendContent />} />
            <YAxis
              dataKey="faculty"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={150}
              className="title-small-primary"
            />
            <XAxis type="number" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            {["desktop", "mobile", "ipad"].map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`var(--color-${key})`}
                radius={BAR_RADIUS}
                barSize={BAR_SIZE}
                
                
              >
                <LabelList
                  dataKey={key}
                  position="right"
                  offset={LABEL_OFFSET}
                  className="fill-foreground hidden md:block"
                  fontSize={LABEL_FONT_SIZE}
                />
              </Bar>
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
