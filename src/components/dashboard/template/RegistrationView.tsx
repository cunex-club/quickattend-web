"use client";
import { useState, useMemo } from "react";
import IonIcon from "@shared/IonIcon";
import Link from "next/dist/client/link";
import SearchBar from "../DashboardSearchBar";
import Pagination from "@shared/Pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@assets/components/ui/popover";
import { Checkbox } from "@assets/components/ui/checkbox";
import { Label } from "@assets/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@assets/components/ui/dropdown-menu";
import { cn } from "@assets/lib/utils";
import { registrationData } from "@utils/data";

const MOCK_DATA = registrationData;

const STATUS_LABEL_MAP: Record<string, string> = {
  success: "ลงทะเบียนสำเร็จ",
  failed: "ลงทะเบียนไม่สำเร็จ",
  warning: "ลงทะเบียนแล้ว",
};

const renderStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return (
        <span className="inline-flex items-center gap-0.5 pl-1 pr-4 py-1 bg-success text-white rounded-full label-medium-emphasized whitespace-nowrap">
          <IonIcon name="CheckmarkCircle" size="16px" />
          ลงทะเบียนสำเร็จ
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-0.5 pl-1 pr-4 py-1 bg-error text-white rounded-full label-medium-emphasized whitespace-nowrap">
          <IonIcon name="CloseCircle" size="16px" />
          ลงทะเบียนไม่สำเร็จ
        </span>
      );
    case "warning":
      return (
        <span className="inline-flex items-center gap-0.5 pl-1 pr-4 py-1 bg-warning text-white rounded-full label-medium-emphasized whitespace-nowrap">
          <IonIcon name="RefreshCircle" size="16px" />
          ลงทะเบียนแล้ว
        </span>
      );
    default:
      return null;
  }
};

// ─── Inline Filter Popover (reusable within this file) ───
interface TableFilterPopoverProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  displayLabelMap?: Record<string, string>;
  className?: string;
  children: React.ReactNode;
}

const TableFilterPopover = ({
  options,
  selectedValues,
  onChange,
  displayLabelMap,
  className,
  children,
}: TableFilterPopoverProps) => {
  const isActive = selectedValues.length > 0;

  const handleToggle = (value: string, checked: boolean) => {
    const next = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value);
    onChange(next);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <th
          className={cn(
            "px-4 py-3 whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors",
            className,
          )}
        >
          <div className="flex flex-row items-center justify-between gap-2 label-large-emphasized w-full">
            <p className="label-large-emphasized">{children}</p>
            <div className="relative">
              <IonIcon name="FilterOutline" size="18px" />
              <div
                className={cn(
                  "absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full transition-all duration-300 ease-in-out",
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0",
                )}
              />
            </div>
          </div>
        </th>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start">
        <div className="flex flex-col space-y-3">
          <p className="label-large-emphasized text-center">ตัวกรอง</p>
          <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto">
            {options.map((opt) => (
              <div key={opt} className="flex items-center space-x-3 py-1">
                <Checkbox
                  id={`filter-${opt}`}
                  checked={selectedValues.includes(opt)}
                  onCheckedChange={(checked) =>
                    handleToggle(opt, checked as boolean)
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor={`filter-${opt}`} className="cursor-pointer">
                  <p className="body-large-primary">
                    {displayLabelMap?.[opt] ?? opt}
                  </p>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const RegistrationView = () => {
  const [expandedRemarks, setExpandedRemarks] = useState<number[]>([]);
  const toggleRemark = (index: number) => {
    setExpandedRemarks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  // ─── Filter & Sort State ───
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [facultyFilter, setFacultyFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null,
  );

  // ─── Derive unique filter options from data ───
  const typeOptions = useMemo(
    () => [...new Set(MOCK_DATA.map((d) => d.type))],
    [],
  );
  const facultyOptions = useMemo(
    () => [...new Set(MOCK_DATA.map((d) => d.faculty))],
    [],
  );
  const statusOptions = useMemo(
    () => [...new Set(MOCK_DATA.map((d) => d.status))],
    [],
  );

  // ─── Filtered & Sorted Data ───
  const filteredData = useMemo(() => {
    let data = [...MOCK_DATA];

    if (typeFilter.length > 0) {
      data = data.filter((d) => typeFilter.includes(d.type));
    }
    if (facultyFilter.length > 0) {
      data = data.filter((d) => facultyFilter.includes(d.faculty));
    }
    if (statusFilter.length > 0) {
      data = data.filter((d) => statusFilter.includes(d.status));
    }

    if (sortDirection) {
      data.sort((a, b) => {
        const cmp = a.time.localeCompare(b.time);
        return sortDirection === "asc" ? cmp : -cmp;
      });
    }

    return data;
  }, [typeFilter, facultyFilter, statusFilter, sortDirection]);

  return (
    <div className="flex flex-col items-center w-full max-h-screen px-4 md:px-8 py-12 bg-neutral-white space-y-4">
      <section className="w-full flex flex-col items-center bg-neutral-white space-y-2 py-2">
        {/* back button */}
        <div className="relative flex items-center w-full h-10">
          <Link
            href="/dashboard/insights"
            className="flex flex-row space-x-1 items-center cursor-pointer z-10 text-primary transition-all duration-300 ease-in-out hover:scale-110 hover:opacity-80"
          >
            <IonIcon name="ChevronBackOutline" size="20px" />
            <p className="label-large-emphasized hidden md:block">ย้อนกลับ</p>
          </Link>

          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <p className="headline-small-emphasized md:headline-medium-emphasized xl:headline-large-emphasized text-center whitespace-nowrap">
              ประวัติการลงทะเบียน
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col md:flex-row justify-between items-center gap-4 w-full mt-2">
        {/* event name */}
        <p className="title-large-emphasized my-auto">Freshmen night</p>
        {/* icons group */}
        <div className="space-x-4 flex flex-row justify-center items-center">
          {/* search bar */}
          <SearchBar
            placeholder="ค้นหาด้วยชื่อ-นามสกุล หรือรหัสประจำตัว"
            onsearch={() => {}}
          />
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
            <IonIcon
              name="DownloadOutline"
              size="28px"
              className="text-[#DE5C8E]"
            ></IonIcon>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="w-full h-full overflow-x-auto border-none mt-4 pb-4">
        <table className="w-full text-left border-collapse table-row">
          <thead className="sticky top-0 z-10 w-full">
            <tr className="bg-primary text-neutral-white -translate-y-1">
              <th className="py-3 px-10 whitespace-nowrap label-large-emphasized w-20">
                {/* blank - avatar */}
              </th>
              <th className="px-4 py-3 w-80 min-w-80 whitespace-nowrap label-large-emphasized">
                ชื่อ-นามสกุล
              </th>
              <th className="px-4 py-3 w-40 min-w-40 whitespace-nowrap label-large-emphasized">
                รหัสประจำตัว
              </th>

              {/* ─── Filter: type ─── */}
              <TableFilterPopover
                options={typeOptions}
                selectedValues={typeFilter}
                onChange={setTypeFilter}
                className="w-32 min-w-32"
              >
                ประเภท
              </TableFilterPopover>

              {/* ─── Filter: faculty ─── */}
              <TableFilterPopover
                options={facultyOptions}
                selectedValues={facultyFilter}
                onChange={setFacultyFilter}
                className="w-72 min-w-64"
              >
                คณะ/หน่วยงาน
              </TableFilterPopover>

              {/* ─── Sort: time ─── */}
              <th className="px-4 py-3 w-32 min-w-32 whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex flex-row items-center justify-between gap-2 label-large-emphasized">
                      <p className="label-large-emphasized">เวลา</p>
                      <div className="relative">
                        <IonIcon name="SwapVerticalOutline" size="18px" />
                        <div
                          className={cn(
                            "absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full transition-all duration-300 ease-in-out",
                            sortDirection
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-0",
                          )}
                        />
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="py-2">
                    <DropdownMenuItem
                      onClick={() =>
                        setSortDirection((prev) =>
                          prev === "asc" ? null : "asc",
                        )
                      }
                    >
                      <div
                        className={cn(
                          "body-small-primary",
                          sortDirection === "asc" && "font-bold",
                        )}
                      >
                        เก่าสุดก่อน
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setSortDirection((prev) =>
                          prev === "desc" ? null : "desc",
                        )
                      }
                    >
                      <div
                        className={cn(
                          "body-small-primary",
                          sortDirection === "desc" && "font-bold",
                        )}
                      >
                        ใหม่สุดก่อน
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </th>

              {/* ─── Filter: สถานะการลงทะเบียน ─── */}
              <TableFilterPopover
                options={statusOptions}
                selectedValues={statusFilter}
                onChange={setStatusFilter}
                displayLabelMap={STATUS_LABEL_MAP}
                className="w-52 min-w-52"
              >
                สถานะการลงทะเบียน
              </TableFilterPopover>

              <th className="px-4 py-3 whitespace-nowrap label-large-emphasized w-full">
                หมายเหตุ
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 hover:bg-gray-50 title-medium-primary text-neutral-500 transition-colors ${
                  index % 2 === 0 ? "bg-neutral-white" : "bg-neutral-100"
                }`}
              >
                <td className="whitespace-nowrap flex flex-row justify-center items-center justify-self-center translate-y-1">
                  {item.avatar && (
                    <img
                      src={item.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap align-top translate-y-2.5">
                  {item.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap min-w-32 align-top translate-y-2.5">
                  {item.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap min-w-20 w-20 text-center align-top translate-y-2.5">
                  {item.type}
                </td>
                <td className="px-4 py-3 whitespace-nowrap align-top translate-y-2.5">
                  {item.faculty}
                </td>
                <td className="px-4 py-3 whitespace-nowrap min-w-24 align-top translate-y-2.5">
                  {item.time}
                </td>
                <td className="px-4 py-3 whitespace-nowrap flex flex-row justify-center items-center">
                  {renderStatusBadge(item.status)}
                </td>
                <td
                  className={`px-4 py-3 min-w-xl max-w-xl cursor-pointer transition-all duration-300 ${
                    expandedRemarks.includes(index)
                      ? "whitespace-normal break-words"
                      : "truncate"
                  }`}
                  title={item.remark}
                  onClick={() => toggleRemark(index)}
                >
                  {item.remark}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="w-full flex flex-col md:flex-row justify-between gap-4 mt-0 md:mt-4">
        <p className="label-large-primary text-neutral-600">
          แสดงผลลัพธ์ 1 ถึง 20 จาก 620 รายการ
        </p>
        <div>
          <Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />
        </div>
      </footer>
    </div>
  );
};
