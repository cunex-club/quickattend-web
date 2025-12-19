import {
  Bar,
  BarChart,
  LabelList,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@assets/components/ui/chart";

export const description = "A multiple bar chart";

const chartData = [
  { faculty: "คณะวิศวกรรมศาสตร์", desktop: 186, mobile: 80, ipad: 50, iphone: 30 },
  { faculty: "คณะอักษรศาสตร์", desktop: 305, mobile: 200, ipad: 100, iphone: 40 },
  { faculty: "คณะวิทยาศาสตร์", desktop: 237, mobile: 120, ipad: 80, iphone: 35 },
  { faculty: "คณะรัฐศาสตร์", desktop: 73, mobile: 190, ipad: 60, iphone: 25 },
  { faculty: "คณะสถาปัตยกรรมศาสตร์", desktop: 209, mobile: 130, ipad: 90, iphone: 45 },
];

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function BarChartVerticalMulti() {
  // Get all data keys except the category key
  const dataKeys = Object.keys(chartData[0]).filter(key => key !== "faculty");
  
  // Dynamically generate chartConfig
  const chartConfig = dataKeys.reduce((config, key, index) => {
    config[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>) satisfies ChartConfig;

  const BAR_SIZE: number = 32;
  const BAR_GAP: number = 16*chartData.length;
  const BAR_RADIUS: number = 2;
  const LABEL_OFFSET: number = 8;
  const LABEL_FONT_SIZE: number = 16;
  const BAR_GAP_WITHIN_GROUP: number = 0;
  const BAR_CATEGORY_GAP: number = BAR_GAP;
  const dynamicHeight: number = chartData.length * (BAR_SIZE + BAR_GAP + BAR_CATEGORY_GAP);
    
  return (
    <Card className="bg-neutral-100 shadow-elevation-2">
      <CardContent className="overflow-visible mx-0 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-48 py-6 md:py-8">
        <ChartContainer 
          config={chartConfig} 
          className="overflow-visible w-full chart-hover-bar"
          style={{ height: `${dynamicHeight}px` }}
        >
          <BarChart 
            accessibilityLayer 
            data={chartData} 
            layout="vertical"
            margin={{ left: 20 }}
            barGap={BAR_GAP_WITHIN_GROUP}
            barCategoryGap={BAR_CATEGORY_GAP}
          >
            <ChartLegend content={<ChartLegendContent />} />
            <YAxis
              dataKey="faculty"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={150}
              className="title-small-primary"
            />
            <XAxis type="number" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                radius={BAR_RADIUS}
                barSize={BAR_SIZE}
              >
                {chartData.map((entry, dataIndex) => (
                  <Cell
                    key={`cell-${key}-${dataIndex}`}
                  />
                ))}
                <LabelList
                  dataKey={key}
                  position="right"
                  offset={LABEL_OFFSET}
                  className="fill-foreground hidden md:block"
                  fontSize={LABEL_FONT_SIZE}
                />
              </Bar>
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
