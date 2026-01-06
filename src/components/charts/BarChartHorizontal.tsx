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
import { BarChartHorizontalProps } from "@customTypes/chart";
import { useIsMobile, useIsTablet } from "@assets/hooks/use-mobile";

// CONSTANTS

const chartConfig = {
  XAxis: {
    color: "var(--color-neutral-400)",
  },
  YAxis: {
    color: "var(--color-neutral-400)",
  },
  CartesianGrid: {
    color: "var(--color-neutral-300)",
  },
  total: {
    label: "total",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const CHART_CONSTANTS = {
  BAR_RADIUS: [8, 8, 0, 0] as [number, number, number, number],
  BAR_CATEGORY_GAP: 1,
  LABEL_OFFSET: 12,
  LABEL_FONT_SIZE: 12,
  WIDTH_PER_BAR_DESKTOP: 180,
  WIDTH_PER_BAR_TABLET: 150,
  WIDTH_PER_BAR_MOBILE: 100,
  STROKE_DASH_ARRAY: "3 3",
} as const;

// HELPER FUNCTIONS

const getChartWidth = (
  dataLength: number,
  isMobile: boolean,
  isTablet: boolean
): number => {
  if (isMobile) return dataLength * CHART_CONSTANTS.WIDTH_PER_BAR_MOBILE;
  if (isTablet) return dataLength * CHART_CONSTANTS.WIDTH_PER_BAR_TABLET;
  return dataLength * CHART_CONSTANTS.WIDTH_PER_BAR_DESKTOP;
};

// Component

export function BarChartHorizontal({
  data,
}: {
  data: BarChartHorizontalProps[];
}) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const chartWidth = getChartWidth(data.length, isMobile, isTablet);

  return (
    <Card className="p-0 border-none shadow-none">
      <CardContent className="px-0">
        <div className="w-full overflow-x-auto">
          <ChartContainer
            config={chartConfig}
            className="h-[280px] md:h-[350px] lg:h-[400px] w-full pr-3 mb-4 chart-hover-bar"
            style={{ minWidth: `${chartWidth}px` }}
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                top: 20,
              }}
              barCategoryGap={CHART_CONSTANTS.BAR_CATEGORY_GAP}
            >
              <CartesianGrid
                horizontal={true}
                vertical={false}
                stroke="var(--color-CartesianGrid)"
                strokeWidth={0.4}
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
              />
              <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={CHART_CONSTANTS.BAR_RADIUS}
              >
                <LabelList
                  position="top"
                  offset={CHART_CONSTANTS.LABEL_OFFSET}
                  className="fill-neutral-black"
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
