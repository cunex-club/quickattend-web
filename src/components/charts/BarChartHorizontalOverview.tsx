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

// CONSTANTS

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

const CHART_CONSTANTS = {
  BAR_RADIUS: [8, 8, 0, 0] as [number, number, number, number],
  BAR_CATEGORY_GAP: 1,
  STROKE_DASH_ARRAY: "3 3",
  LABEL_OFFSET: 12,
  LABEL_FONT_SIZE: 12,
  WIDTH_PER_BAR: 120,
  DOMAIN_MULTIPLIER: 1.35,
} as const;

// Component

export function BarChartHorizontalOverview({
  data,
  maxValue,
}: BarChartHorizontalOverviewProps) {
  const chartWidth = data.length * CHART_CONSTANTS.WIDTH_PER_BAR;
  const domainY = maxValue ?? data.reduce((max, item) => Math.max(max, item.total), 0);

  return (
    <Card className="py-0 px-0 h-full relative border-none shadow-none">
      <CardContent className="px-0 py-0 h-full">
        <div
          className="min-w-full h-full md:w-full"
          style={{ width: `${chartWidth}px` }}
        >
          <ChartContainer
            config={chartConfig}
            className="w-full h-full chart-hover-bar"
          >
            <BarChart
              accessibilityLayer
              data={data}
              barCategoryGap={CHART_CONSTANTS.BAR_CATEGORY_GAP}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--color-CartesianGrid)"
                strokeDasharray={CHART_CONSTANTS.STROKE_DASH_ARRAY}
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
                domain={[0, domainY * CHART_CONSTANTS.DOMAIN_MULTIPLIER]}
                tickCount={7}
                tickFormatter={(value) => value.toFixed(0)}
              />
              <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={CHART_CONSTANTS.BAR_RADIUS}
              >
                <LabelList
                  dataKey="total"
                  position="top"
                  className="fill-neutral-black"
                  offset={CHART_CONSTANTS.LABEL_OFFSET}
                  fontSize={CHART_CONSTANTS.LABEL_FONT_SIZE}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
