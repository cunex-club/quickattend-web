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
import { BarChartHorizontalOverviewProps } from "@customTypes/chart";

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
  total: {
    label: "Total",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export function BarChartHorizontalOverview({
  data,
}: BarChartHorizontalOverviewProps) {
  const BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0];
  const BAR_CATEGORY_GAP: number = 1;
  const STROKE_DASH_ARRAY: string = "3 3";
  const LABEL_OFFSET: number = 12;
  const LABEL_FONT_SIZE: number = 12;

  // Calculate dynamic height based on number of bars
  const chartWidth = data.length * 120;
  const domainY = data.reduce((max, item) => Math.max(max, item.total), 0);

  return (
    <Card className="py-0 px-0 h-full relative border-none shadow-none">
      <CardContent className="px-0 py-0 h-full">
        <div
          className="min-w-full h-full md:w-full"
          style={{ minWidth: `${chartWidth}px` }}
        >
          <ChartContainer
            config={chartConfig}
            className="w-full h-full chart-hover-bar"
          >
            <BarChart
              accessibilityLayer
              data={data}
              barCategoryGap={BAR_CATEGORY_GAP}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--color-CartesianGrid)"
                strokeDasharray={STROKE_DASH_ARRAY}
              />
              <XAxis
                dataKey="time"
                tickLine={false}
                tickMargin={10}
                axisLine={true}
                stroke={"var(--color-XAxis)"}
              />
              <YAxis
                type="number"
                dataKey="total"
                tickLine={false}
                tickMargin={10}
                axisLine={true}
                stroke={"var(--color-YAxis)"}
                domain={[0, domainY * 1.35]}
                tickCount={7}
                tickFormatter={(value) => value.toFixed(0)}
              />
              <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={BAR_RADIUS}
              >
                <LabelList
                  dataKey="total"
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
