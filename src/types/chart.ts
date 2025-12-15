export interface BarChartVerticalData {
    faculty: string;
    total: number;
}

export interface BarChartHorizontalData {
    time: string;
    count: number;
}

export interface ChartStyleConfig {
    barSize?: number;
    barGap?: number;
    barRadius?: [number, number, number, number];
    labelOffset?: number;
    labelFontSize?: number;
}
