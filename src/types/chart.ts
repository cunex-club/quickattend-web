// Bar Chart - Horizontal
export type BarChartHorizontalProps = {
  time: string;
  total: number;
};

export type BarChartHorizontalOverviewProps = {
  data: BarChartHorizontalProps[];
  maxValue?: number;
};

// Bar Chart - Vertical
export interface BarChartVerticalData {
  faculty: string;
  total: number;
}

export interface BarChartVerticalOverviewProps {
  data: BarChartVerticalData[];
}
