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
import { useIsMobile, useIsTablet } from "@assets/hooks/use-mobile";
import { BarChartVerticalProps } from "@customTypes/chart";

const chartConfig = {
  total: {
    label: "Total",

    color: "var(--color-primary)",
  },

  label: {
    color: "var(--color-neutral-black)",
  },
} satisfies ChartConfig;

export function BarChartVertical({ data }: { data: BarChartVerticalProps[] }) {
  const chartData = data;

  const BAR_CHART_RADIUS: [number, number, number, number] = [2, 2, 2, 2];
  const LABEL_OFFSET: number = 8;
  const LABEL_FONT_SIZE: number = 14;

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  let BAR_SIZE: number = 28;
  if (isMobile) {
    BAR_SIZE = 16;
  } else if (isTablet) {
    BAR_SIZE = 15;
  }

  const maxDataValue = Math.max(...chartData.map((d) => d.total));
  const xDomainMax = (maxDataValue || 0) * 1.15;

  // Compute percentage once to optionally show in tooltips (no transparent overlay)
  const totalSum = chartData.reduce((sum, item) => sum + item.total, 0);
  const chartDataWithMeta = chartData.map((item) => ({
    ...item,
    percentage: totalSum > 0 ? ((item.total / totalSum) * 100).toFixed(1) : "0",
  }));

  return (
    <Card className="bg-neutral-white lg:bg-neutral-100 border-none shadow-none lg:py-8 pl-0 lg:pl-8 lg:pr-6 rounded-[28px] w-full">
      <CardContent className="mr-2 max-h-[470px] overflow-auto">
        <div className="chart-list-group flex flex-col space-y-4">
          {chartDataWithMeta.map((item, idx) => (
            <div
              key={`faculty-chart-${idx}`}
              className="flex flex-col space-y-3 md:space-y-5 lg:space-y-4 chart-item"
            >
              <div className="flex items-center justify-between">
                <p className="title-medium-primary md:title-large-primary">
                  {item.faculty}
                </p>
                <p className="body-medium-primary md:body-large-primary text-[var(--color-label)]">
                  {item.total} คน ({item.percentage}%)
                </p>
              </div>
              <ChartContainer
                config={chartConfig}
                style={{ maxHeight: `${BAR_SIZE}px` }}
                className="w-full chart-hover-bar "
              >
                <BarChart
                  accessibilityLayer
                  data={[item]}
                  layout="vertical"
                  margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
                >
                  <CartesianGrid horizontal={false} vertical={false} />
                  <YAxis
                    dataKey="faculty"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    hide
                  />
                  <XAxis
                    dataKey="total"
                    type="number"
                    hide
                    domain={[0, xDomainMax]}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
