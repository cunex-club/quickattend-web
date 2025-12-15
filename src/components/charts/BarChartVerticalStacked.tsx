"use client";

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
    label: "จำนวนผู้ที่ลงทะเบียนไม่สำเร็จ",
    color: "var(--chart-pink-200)",
  },
  registered: {
    label: "จำนวนผู้ที่ลงทะเบียนสำเร็จ",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export function BarChartVerticalStacked({data} : {data: BarChartVerticalStackedProps[]}) {
  const BAR_SIZE: number = 32;
  const BAR_GAP: number = 48;
  const LEFT_BAR_BORDER_RADIUS: [number, number, number, number] = [0, 2, 2, 0];
  const RIGHT_BAR_BORDER_RADIUS: [number, number, number, number] = [
    2, 2, 2, 2,
  ];
  const dynamicHeight: number = data.length * (BAR_SIZE + BAR_GAP);

  return (
    <Card className="bg-neutral-100 shadow-elevation-2 w-full px-6 lg:px-8">
      <CardContent className="px-0">
        <ChartContainer
          config={chartConfig}
          className="w-full"
          style={{ height: `${dynamicHeight}px` }}
        >
          <BarChart
            data={data}
            layout="vertical"
            accessibilityLayer
            margin={{ left: 0, right: 20 }}
            barCategoryGap={BAR_GAP}
          >
            <ChartLegend
              content={<ChartLegendContent className="translate-y-[50%]" />}
            />
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} hide />
            <YAxis
              dataKey="faculty"
              type="category"
              tickLine={false}
              axisLine={false}
              hide
            />
            <ChartTooltip content={<ChartTooltipContent />} />

            <Bar
              dataKey="faculty"
              stackId="label"
              fill="transparent"
              radius={LEFT_BAR_BORDER_RADIUS}
              barSize={BAR_SIZE}
              legendType="none"
              tooltipType="none"
            >
              <LabelList
                dataKey="faculty"
                position="insideLeft"
                offset={0}
                className="fill-[var(--color-label)] font-var(--font-chula-regular) text-[22px] leading-[28px] tracking-[0px] -translate-y-[-5px]"
              />
            </Bar>
            <Bar
              dataKey="unregistered"
              stackId="a"
              fill="var(--color-unregistered)"
              radius={LEFT_BAR_BORDER_RADIUS}
              barSize={BAR_SIZE}
            >
              <LabelList
                dataKey="unregistered"
                position="insideRight"
                className="fill-neutral-white"
              />
            </Bar>
            <Bar
              dataKey="registered"
              stackId="a"
              fill="var(--color-registered)"
              radius={RIGHT_BAR_BORDER_RADIUS}
              barSize={BAR_SIZE}
            >
              <LabelList
                dataKey="registered"
                position="insideRight"
                className="fill-neutral-white"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
