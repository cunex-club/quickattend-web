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

// CONSTANTS

const chartConfig = {
  total: {
    label: "Total",

    color: "var(--color-primary)",
  },

  label: {
    color: "var(--color-neutral-black)",
  },
} satisfies ChartConfig;

const BAR_CONSTANTS = {
  RADIUS: [2, 2, 2, 2] as [number, number, number, number],
  LABEL_OFFSET: 8,
  LABEL_FONT_SIZE: 14,
  SIZE_DESKTOP: 28,
  SIZE_TABLET: 15,
  SIZE_MOBILE: 16,
  DOMAIN_MULTIPLIER: 1.15,
} as const;

// HELPER FUNCTIONS

const getBarSize = (isMobile: boolean, isTablet: boolean): number => {
  if (isMobile) return BAR_CONSTANTS.SIZE_MOBILE;
  if (isTablet) return BAR_CONSTANTS.SIZE_TABLET;
  return BAR_CONSTANTS.SIZE_DESKTOP;
};

const calculateXDomain = (data: BarChartVerticalProps[]): number => {
  const maxValue = Math.max(...data.map((d) => d.total));
  return (maxValue || 0) * BAR_CONSTANTS.DOMAIN_MULTIPLIER;
};

const addPercentageMetadata = (data: BarChartVerticalProps[]) => {
  const totalSum = data.reduce((sum, item) => sum + item.total, 0);
  return data.map((item) => ({
    ...item,
    percentage: totalSum > 0 ? ((item.total / totalSum) * 100).toFixed(1) : "0",
  }));
};

// Component

export function BarChartVertical({ data }: { data: BarChartVerticalProps[] }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const barSize = getBarSize(isMobile, isTablet);
  const xDomainMax = calculateXDomain(data);
  const chartDataWithMeta = addPercentageMetadata(data);

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
                style={{ maxHeight: `${barSize}px` }}
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
                    radius={BAR_CONSTANTS.RADIUS}
                    barSize={barSize}
                  >
                    <LabelList
                      dataKey="total"
                      position="right"
                      offset={BAR_CONSTANTS.LABEL_OFFSET}
                      className="fill-foreground"
                      fontSize={BAR_CONSTANTS.LABEL_FONT_SIZE}
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
