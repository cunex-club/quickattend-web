export interface CompareStat {
  id: string;
  label: string;
  total: number;
  studentCount: number;
  staffCount: number;
}

export interface SummaryStats {
  totalAttendees: number;
  studentCount: number;
  staffCount: number;
}

export interface PieChartDataItem {
  name: string;
  value: number;
  fill: string;
}

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function calculateSummaryStats(
  stats: CompareStat[],
  selectedIds: string[],
): SummaryStats {
  const selected = stats.filter((s) => selectedIds.includes(s.id));

  return selected.reduce(
    (acc, s) => ({
      totalAttendees: acc.totalAttendees + s.total,
      studentCount: acc.studentCount + s.studentCount,
      staffCount: acc.staffCount + s.staffCount,
    }),
    { totalAttendees: 0, studentCount: 0, staffCount: 0 },
  );
}

export function preparePieChartData(
  stats: CompareStat[],
  selectedIds: string[],
  otherLabel: string,
): PieChartDataItem[] {
  const noData: PieChartDataItem[] = [
    { name: "No Data", value: 1, fill: "var(--neutral-300)" },
  ];

  if (selectedIds.length === 0) return noData;

  const distribution = stats
    .filter((s) => selectedIds.includes(s.id))
    .map((s) => ({ name: s.label, value: s.total }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  if (distribution.length === 0) return noData;

  if (distribution.length > 5) {
    const top5 = distribution.slice(0, 5);
    const others = distribution.slice(5);
    const othersTotal = others.reduce((sum, item) => sum + item.value, 0);

    return [
      ...top5.map((item, index) => ({ ...item, fill: PIE_COLORS[index] })),
      { name: otherLabel, value: othersTotal, fill: "var(--neutral-300)" },
    ];
  }

  return distribution.map((item, index) => ({
    ...item,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));
}
