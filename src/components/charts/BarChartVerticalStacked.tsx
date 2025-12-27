import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";

type BarChartVerticalStackedProps = {
  faculty: string;
  registered: number;
  unregistered: number;
};

const chartConfig = {
  unregistered: {
    label: "จำนวนผู้ที่ยังไม่ได้ลงทะเบียน",
    color: "var(--chart-pink-200)",
  },
  registered: {
    label: "จำนวนผู้ลงทะเบียนสำเร็จ",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export function BarChartVerticalStacked({
  data,
}: {
  data: BarChartVerticalStackedProps[];
}) {
  const BAR_SIZE: number = 36;
  const LEFT_BAR_BORDER_RADIUS: [number, number, number, number] = [2, 0, 0, 2];
  const RIGHT_BAR_BORDER_RADIUS: [number, number, number, number] = [0, 2, 2, 0];

  const maxDataValue = Math.max(...data.map((d) => d.registered + d.unregistered));
  const xDomainMax = (maxDataValue || 0) * 1.15;

  const totalSum = data.reduce((sum, item) => sum + item.registered + item.unregistered, 0);
  const chartDataWithMeta = data.map((item) => {
    const total = item.registered + item.unregistered;
    return {
      ...item,
      total,
      percentage: totalSum > 0 ? ((total / totalSum) * 100).toFixed(1) : "0",
    };
  });

  return (
    <Card className="bg-neutral-100 w-full px-6 lg:px-8 py-8 shadow-none border-none rounded-3xl">
      <CardContent className="px-0 flex flex-col space-y-6">
        <div className="flex flex-col space-y-4">
          {chartDataWithMeta.map((item, idx) => {
            return (
              <div key={`faculty-stacked-${idx}`} className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <p className="title-medium-primary md:title-large-primary -translate-y-0.5  md:-translate-y-1.5">
                    {item.faculty}
                  </p>
                  <p className="body-medium-primary md:body-large-primary text-neutral-500">
                    {item.total} คน ({item.percentage}%)
                  </p>
                </div>
                <ChartContainer
                  config={chartConfig}
                  className="w-full chart-hover-bar"
                  style={{ maxHeight: `${BAR_SIZE}px` }}
                >
                  <BarChart
                    data={[item]}
                    layout="vertical"
                    accessibilityLayer
                    margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
                  >
                    <CartesianGrid horizontal={false} vertical={false} />
                    <XAxis type="number" tickLine={false} axisLine={false} hide domain={[0, xDomainMax]} />
                    <YAxis
                      dataKey="faculty"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      hide
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="unregistered"
                      stackId="a"
                      fill="var(--color-unregistered)"
                      radius={LEFT_BAR_BORDER_RADIUS}
                      barSize={BAR_SIZE}
                    >
                      <Cell />
                      <LabelList
                        dataKey="unregistered"
                        position="insideRight"
                        className="fill-neutral-white text-xs"
                      />
                    </Bar>
                    <Bar
                      dataKey="registered"
                      stackId="a"
                      fill="var(--color-registered)"
                      radius={RIGHT_BAR_BORDER_RADIUS}
                      barSize={BAR_SIZE}
                    >
                      <Cell />
                      <LabelList
                        dataKey="registered"
                        position="insideRight"
                        className="fill-neutral-white text-xs"
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            );
          })}
        </div>
        <div className="w-full flex justify-center">
          <div className="flex justify-center items-center space-x-8 md:space-x-16">
            <div className="flex flex-row space-x-2 items-center">
              <div className="w-4 h-4 bg-primary"></div>
              <p className="label-small-primary -translate-y-0.5">จำนวนผู้ลงทะเบียนสำเร็จ</p>
            </div>
            <div className="flex flex-row space-x-2 items-center">
              <div className="w-4 h-4 bg-chart-pink-200"></div>
              <p className="label-small-primary -translate-y-0.5">จำนวนผู้ที่ยังไม่ได้ลงทะเบียน</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
