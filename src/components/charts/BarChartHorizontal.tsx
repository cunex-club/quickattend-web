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

export function BarChartHorizontal({
  data,
}: {
  data: BarChartHorizontalProps[];
}) {
  const BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0];
  const BAR_CATEGORY_GAP: number = 1;
  const LABEL_OFFSET: number = 12;
  const LABEL_FONT_SIZE: number = 12;

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  let chartWidth = data.length * 180;
  if (isMobile) {
    chartWidth = data.length * 100;
  } else if (isTablet) {
    chartWidth = data.length * 150;
  }

  return (
    <Card className="p-0 border-none shadow-none">
      <CardContent className="px-0">
        <div className="w-full overflow-x-auto">
          <ChartContainer
            config={chartConfig}
            className="max-h-[280px] md:max-h-[350px] lg:max-h-[400px] w-full pr-3 mb-4 chart-hover-bar"
            style={{ minWidth: `${chartWidth}px` }}
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
                <LabelList
                  position="top"
                  offset={LABEL_OFFSET}
                  className="fill-neutral-black"
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
