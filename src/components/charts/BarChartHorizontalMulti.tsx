import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  LabelList,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";
import { BarChartHorizontalMultiProps } from "@customTypes/chart";

export const description = "A multiple bar chart";

const chartConfig = {
  XAxis: {
    color: "var(--color-neutral-400)",
  },
  YAxis: {
    color: "var(--color-neutral-400)",
  },
  CartesianGrid: {
    color: "var(--color-gray-300)",
  },
} satisfies ChartConfig;

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function BarChartHorizontalMulti({
  data,
}: BarChartHorizontalMultiProps) {
  const BAR_SPACING = 0;
  const BAR_RADIUS = 2;
  const LABEL_OFFSET: number = 8;
  const LABEL_FONT_SIZE: number = 14;
  const STROKE_DASH_ARRAY: string = "3 3";

  // Transform nested data structure to flat structure for Recharts
  // From: [{faculty, data: [{time, total}]}]
  // To: [{time, faculty1: total, faculty2: total, ...}]
  const transformData = () => {
    if (!data || data.length === 0) return [];

    const timeMap = new Map<string, Record<string, string | number>>();

    // Collect all unique times and faculty data
    data.forEach(({ faculty, data: timeData }) => {
      timeData.forEach(({ time, total }) => {
        if (!timeMap.has(time)) {
          timeMap.set(time, { time });
        }
        const entry = timeMap.get(time)!;
        entry[faculty] = total;
      });
    });

    return Array.from(timeMap.values());
  };

  const chartData = transformData();

  // Extract faculty names for series
  const faculties = data.map((item) => item.faculty);

  return (
    <Card className="px-0 border-none shadow-none">
      <CardContent className="px-0 overflow-auto">
        <div className="min-w-[1000px] sm:min-w-[2000px] md:min-w-[1500px] lg:min-w-[1300px] w-full">
          <ChartContainer
            config={chartConfig}
            className="w-full pr-3 h-[250px] md:h-[450px] chart-hover-bar"
          >
            <BarChart accessibilityLayer data={chartData} barGap={BAR_SPACING}>
              <CartesianGrid
                horizontal={true}
                vertical={false}
                stroke="var(--color-gray-300)"
                strokeWidth={0.4}
                strokeDasharray={STROKE_DASH_ARRAY}
              />
              <XAxis
                dataKey="time"
                tickLine={false}
                tickMargin={10}
                axisLine={true}
              />
              <YAxis
                type="number"
                tickLine={false}
                axisLine={true}
                tickFormatter={(value) => value.toString()}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              {faculties.map((faculty, index) => (
                <Bar
                  key={faculty}
                  dataKey={faculty}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  radius={BAR_RADIUS}
                >
                  <LabelList
                    dataKey={faculty}
                    position="top"
                    offset={LABEL_OFFSET}
                    className="fill-foreground"
                    fontSize={LABEL_FONT_SIZE}
                  />
                </Bar>
              ))}
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>

      {/* Legend section */}
      <div className="w-full flex justify-center">
        <div className="flex flex-row flex-wrap gap-4 justify-center items-center space-x-8 md:space-x-16 px-10">
          {faculties.map((faculty, index) => (
            <div key={faculty} className="flex flex-row space-x-2 items-center">
              <div
                className="w-4 h-4"
                style={{
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                }}
              />
              <p className="label-small-primary">{faculty}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
