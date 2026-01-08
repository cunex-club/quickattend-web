// Common Chart Configuration Type

export interface ChartStyleConfig {
  barSize?: number;
  barGap?: number;
  barRadius?: [number, number, number, number];
  labelOffset?: number;
  labelFontSize?: number;
}

// Bar Chart - Horizontal

export type BarChartHorizontalProps = {
  time: string;
  total: number;
};

export type BarChartHorizontalOverviewProps = {
  data: BarChartHorizontalProps[];
};

// Multi-select horizontal bar chart types
export type BarChartHorizontalMultiTimeData = {
  time: string;
  total: number;
};

export type BarChartHorizontalMultiFacultyData = {
  faculty: string;
  data: BarChartHorizontalMultiTimeData[];
};

export interface BarChartHorizontalMultiProps {
  data: BarChartHorizontalMultiFacultyData[];
}

// Bar Chart - Vertical

export interface BarChartVerticalData {
  faculty: string;
  total: number;
}

export type BarChartVerticalProps = {
  faculty: string;
  total: number;
};

export interface BarChartVerticalOverviewProps {
  data: BarChartVerticalData[];
}

// Stacked vertical bar chart types
export type BarChartVerticalStackedProps = {
  faculty: string;
  registered: number;
  unregistered: number;
};

// Multi-select vertical bar chart types
export type BarChartVerticalMultiTimeData = {
  time: string;
  total: number;
};

export type BarChartVerticalMultiFacultyData = {
  faculty: string;
  data: BarChartVerticalMultiTimeData[];
};

export interface BarChartVerticalMultiProps {
  data: BarChartVerticalMultiFacultyData[];
}

// Pie Chart Types

export type PieChartStackedProps = {
  category: string;
  total: number;
};

export interface PieChartWithLabelProps {
  data: {
    category: string;
    total: number;
  }[];
}

// Donut Chart Types

export type DonutChartProps = {
  category: string;
  total: number;
};

export interface DonutChartDataProps {
  data: DonutChartProps[];
}