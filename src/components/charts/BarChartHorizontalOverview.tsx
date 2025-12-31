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
}: BarChartHorizontalOverviewProps) {
  const chartData = data;
  const BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0];
  const BAR_CATEGORY_GAP: number = 1;
  const STROKE_DASH_ARRAY: string = "3 3";
  const LABEL_OFFSET: number = 12;
  const LABEL_FONT_SIZE: number = 12;
  
  // Calculate dynamic height based on number of bars
  const chartWidth = chartData.length * 90;

  return (
    <Card className="py-0 px-0 h-full relative border-none shadow-none">
      <CardContent className="px-0 py-0 h-full">
        <div className="min-w-full h-full md:w-full" style={{ width: `${chartWidth}px` }}>
          <ChartContainer
            config={chartConfig}
            className="w-full h-full chart-hover-bar"
          >
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
        </div>
      </CardContent>
    </Card>
  );
}
