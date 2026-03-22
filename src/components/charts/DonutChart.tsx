"use client";
import { cn } from "@assets/lib/utils";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent } from "@assets/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@assets/components/ui/chart";
import { DonutChartProps } from "@customTypes/chart";
import {
  useIsIpadPro,
  useIsMobile,
  useIsTablet,
} from "@assets/hooks/use-mobile";

// CONSTANTS

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-pink-500)",
  },
} satisfies ChartConfig;

const CHART_CONSTANTS = {
  RADIUS_DESKTOP_INNER: 85,
  RADIUS_DESKTOP_OUTER: 140,
  RADIUS_IPAD_PRO_INNER: 80,
  RADIUS_IPAD_PRO_OUTER: 130,
  RADIUS_TABLET_INNER: 80,
  RADIUS_TABLET_OUTER: 130,
  RADIUS_MOBILE_INNER: 75,
  RADIUS_MOBILE_OUTER: 125,
  LABEL_DISTANCE: 1.6,
  STROKE_WIDTH: 3,
  LABEL_LINE_WIDTH: 2,
  START_ANGLE: 90,
  END_ANGLE: -270,
} as const;

// TYPES

interface LabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  payload?: { category?: string; total?: number };
  percent?: number;
}

interface RadiusConfig {
  innerRadius: number;
  outerRadius: number;
  showLabels: boolean;
}

// HELPER FUNCTIONS

const mapDataWithColors = (data: DonutChartProps[]) => {
  return data.map((item, index) => ({
    ...item,
    fill: index === 0 ? "var(--color-primary)" : "var(--color-gray-300)",
  }));
};

const calculateRegisteredPercent = (data: DonutChartProps[]): string => {
  const total = data.reduce((acc, curr) => acc + curr.total, 0);
  const registered = data[0]?.total || 0;
  return ((registered / total) * 100).toFixed(0);
};

const getResponsiveRadius = (
  isMobile: boolean,
  isTablet: boolean,
  isIpadPro: boolean
): RadiusConfig => {
  if (isMobile) {
    return {
      innerRadius: CHART_CONSTANTS.RADIUS_MOBILE_INNER,
      outerRadius: CHART_CONSTANTS.RADIUS_MOBILE_OUTER,
      showLabels: false,
    };
  }

  if (isIpadPro) {
    return {
      innerRadius: CHART_CONSTANTS.RADIUS_IPAD_PRO_INNER,
      outerRadius: CHART_CONSTANTS.RADIUS_IPAD_PRO_OUTER,
      showLabels: true,
    };
  }

  if (isTablet) {
    return {
      innerRadius: CHART_CONSTANTS.RADIUS_TABLET_INNER,
      outerRadius: CHART_CONSTANTS.RADIUS_TABLET_OUTER,
      showLabels: true,
    };
  }

  return {
    innerRadius: CHART_CONSTANTS.RADIUS_DESKTOP_INNER,
    outerRadius: CHART_CONSTANTS.RADIUS_DESKTOP_OUTER,
    showLabels: true,
  };
};

const createCustomLabel = () => {
  const RADIAN = Math.PI / 180;

  const LabelComponent = (props: LabelProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, payload, percent } =
      props;

    const radius =
      Number(innerRadius ?? 0) +
      (Number(outerRadius ?? 0) - Number(innerRadius ?? 0)) *
        CHART_CONSTANTS.LABEL_DISTANCE;
    const x = Number(cx ?? 0) + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = Number(cy ?? 0) + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    const name = payload?.category ?? "";
    const value = payload?.total ?? "";
    const pct = `${(Number(percent ?? 0) * 100).toFixed(0)}%`;
    const anchor = x > Number(cx ?? 0) ? "start" : "end";

    return (
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        dominantBaseline="central"
        className="recharts-pie-label-text"
      >
        <tspan x={x} className="label-large-primary">
          {name}
        </tspan>
        <tspan x={x} dy="1.5em" className="label-small-primary">
          {value} คน ({pct})
        </tspan>
      </text>
    );
  };

  LabelComponent.displayName = "DonutChartLabel";
  return LabelComponent;
};

// Component

export function DonutChart({ data }: { data: DonutChartProps[] }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isIpadPro = useIsIpadPro();

  const chartData = mapDataWithColors(data);
  const registeredPercent = calculateRegisteredPercent(chartData);
  const { innerRadius, outerRadius, showLabels } = getResponsiveRadius(
    isMobile,
    isTablet,
    isIpadPro
  );
  const customLabel = createCustomLabel();

  return (
    <Card className="flex flex-col py-12 sm:py-10 md:py-0 justify-center border-none shadow-none h-full">
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className={cn(
            "mx-auto h-full w-full p-4",
            "[&_.recharts-surface]:overflow-visible",
            "[&_.recharts-pie-label-line]:stroke-[var(--color-gray-300)]",
            "[&_.recharts-pie-label-text]:fill-[var(--color-primary)]",
            "chart-hover-pie"
          )}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="label-small-primary" />}
            />

            <Pie
              data={chartData}
              dataKey="total"
              nameKey="category"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              strokeWidth={CHART_CONSTANTS.STROKE_WIDTH}
              startAngle={CHART_CONSTANTS.START_ANGLE}
              endAngle={CHART_CONSTANTS.END_ANGLE}
              labelLine={
                showLabels
                  ? { strokeWidth: CHART_CONSTANTS.LABEL_LINE_WIDTH }
                  : false
              }
              label={showLabels ? customLabel : false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={cn("headline-large-emphasized", showLabels)}
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-primary"
                        >
                          {registeredPercent.toLocaleString()}%
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
