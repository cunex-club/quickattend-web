import { useState, useMemo } from "react";
import type { RegistrationItem } from "@customTypes/registration";
import { timeToSeconds, escapeCsv, toExcelTextValue } from "@utils/function";
import { STATUS_LABEL_MAP } from "@components/StatusBadge";

export const useRegistration = (initialData: RegistrationItem[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [facultyFilter, setFacultyFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  const typeOptions = useMemo(() => [...new Set(initialData.map((d) => d.type))], [initialData]);
  const facultyOptions = useMemo(() => [...new Set(initialData.map((d) => d.faculty))], [initialData]);
  const statusOptions = useMemo(() => [...new Set(initialData.map((d) => d.status))], [initialData]);

  const filteredData = useMemo(() => {
    let data = [...initialData];

    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (normalizedQuery) {
      data = data.filter(
        (d) =>
          d.name.toLowerCase().includes(normalizedQuery) ||
          d.id.toLowerCase().includes(normalizedQuery)
      );
    }

    if (typeFilter.length > 0) data = data.filter((d) => typeFilter.includes(d.type));
    if (facultyFilter.length > 0) data = data.filter((d) => facultyFilter.includes(d.faculty));
    if (statusFilter.length > 0) data = data.filter((d) => statusFilter.includes(d.status));

    if (sortDirection) {
      data.sort((a, b) => {
        const cmp = timeToSeconds(a.time) - timeToSeconds(b.time);
        return sortDirection === "asc" ? cmp : -cmp;
      });
    }

    return data;
  }, [initialData, searchQuery, typeFilter, facultyFilter, statusFilter, sortDirection]);

  const handleDownloadCsv = () => {
    const headers = ["ชื่อ-นามสกุล", "รหัสประจำตัว", "ประเภท", "คณะ/หน่วยงาน", "เวลา", "สถานะการลงทะเบียน", "หมายเหตุ"];
    const rows = filteredData.map((item) => [
      item.name.trim(),
      toExcelTextValue(item.id),
      item.type,
      item.faculty,
      item.time,
      STATUS_LABEL_MAP[item.status] ?? item.status,
      item.remark,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCsv(String(cell))).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `registration-history-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    searchQuery, setSearchQuery,
    typeFilter, setTypeFilter, typeOptions,
    facultyFilter, setFacultyFilter, facultyOptions,
    statusFilter, setStatusFilter, statusOptions,
    sortDirection, setSortDirection,
    filteredData,
    handleDownloadCsv,
  };
};