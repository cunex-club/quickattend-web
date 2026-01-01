import {
  Bar,
  BarChart,
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

export const description = "A multiple bar chart";

type TimeData = {
  time: string;
  total: number;
};

type FacultyData = {
  faculty: string;
  data: TimeData[];
};

interface BarChartVerticalMultiProps {
  data: FacultyData[];
}

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

export function BarChartVerticalMulti({ data }: BarChartVerticalMultiProps) {
  const BAR_RADIUS = 2;
  const LABEL_OFFSET: number = 8;
  const LABEL_FONT_SIZE: number = 14;
  const BAR_SIZE: number = 32;

  // Transform nested data structure to flat structure for vertical display
  // From: [{faculty, data: [{time, total}]}]
  // To: [{faculty: faculty1, time1: total, time2: total, ...}, {faculty: faculty2, ...}]
  const transformData = () => {
    if (!data || data.length === 0) return [];

    return data.map(({ faculty, data: timeData }) => {
      const entry: Record<string, string | number> = { faculty };
      timeData.forEach(({ time, total }) => {
        entry[time] = total;
      });
      return entry;
    });
  };

  const chartData = transformData();

  // Extract time labels for series (all unique times from all faculty data)
  const times = new Set<string>();
  data.forEach(({ data: timeData }) => {
    timeData.forEach(({ time }) => {
      times.add(time);
    });
  });
  const timeArray = Array.from(times);

  // Calculate dynamic height based on number of faculties
  const dynamicHeight: number = data.length * (BAR_SIZE) * timeArray.length;

  return (
    <Card className="bg-neutral-100 border-none shadow-none">
      <CardContent className="overflow-visible mx-0 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-48 py-6 md:py-8">
        <div className="flex flex-col border overflow-auto h-[500px]">
          <ChartContainer
            config={chartConfig}
            className="overflow-visible w-full chart-hover-bar"
            style={{ minHeight: `${dynamicHeight}px` }}
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ left: 150 }}
              barGap={0}
            >
              <YAxis
                dataKey="faculty"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={140}
                className="title-small-primary"
              />
              <XAxis type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              {timeArray.map((time, index) => (
                <Bar
                  key={time}
                  dataKey={time}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  radius={BAR_RADIUS}
                  barSize={BAR_SIZE}
                >
                  <LabelList
                    dataKey={time}
                    position="right"
                    offset={LABEL_OFFSET}
                    className="fill-foreground hidden md:block"
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
          {timeArray.map((time, index) => (
            <div key={time} className="flex flex-row space-x-2 items-center">
              <div
                className="w-4 h-4"
                style={{
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                }}
              />
              <p className="label-small-primary">{time}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
