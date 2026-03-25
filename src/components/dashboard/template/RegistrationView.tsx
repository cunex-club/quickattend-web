"use client";
import { useMemo } from "react";
import IonIcon from "@shared/IonIcon";
import Link from "next/link";
import SearchBar from "@components/dashboard/DashboardSearchBar";
import Pagination from "@shared/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@assets/components/ui/dropdown-menu";
import { cn } from "@assets/lib/utils";

import { registrationMockData60 } from "@utils/data";
import { STATUS_LABEL_MAP } from "@components/StatusBadge";
import { TableFilterPopover } from "@components/dashboard/TableFilterPopover";
import { RegistrationTableRow } from "@components/dashboard/template/RegistrationTableRow";
import { useRegistration } from "@hooks/useRegistration";
import type { RegistrationItem } from "@customTypes/registration";

const REGISTRATION_DATA = registrationMockData60 as RegistrationItem[];

export const RegistrationView = () => {
  const {
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    typeOptions,
    facultyFilter,
    setFacultyFilter,
    facultyOptions,
    statusFilter,
    setStatusFilter,
    statusOptions,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    paginatedData,
    handleDownloadCsv,
  } = useRegistration(REGISTRATION_DATA);

  const { startResult, endResult } = useMemo(() => {
    if (totalItems === 0) {
      return { startResult: 0, endResult: 0 };
    }

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return { startResult: start, endResult: end };
  }, [currentPage, itemsPerPage, totalItems]);

  return (
    <div className="flex flex-col items-center w-full max-h-screen px-4 md:px-8 py-6 bg-neutral-white space-y-4">
      {/* Header */}
      <section className="w-full flex flex-col items-center bg-neutral-white space-y-2 py-2">
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

      {/* Toolbar */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 w-full mt-2">
        <p className="title-large-emphasized my-auto">Freshmen night</p>
        <div className="space-x-4 flex flex-row justify-center items-center">
          <SearchBar
            placeholder="ค้นหาด้วยชื่อ-นามสกุล หรือรหัสประจำตัว"
            onsearch={setSearchQuery}
          />
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="flex flex-col items-center cursor-pointer hover:opacity-80"
            aria-label="Download registration history as CSV"
          >
            <IonIcon
              name="DownloadOutline"
              size="28px"
              className="text-[#DE5C8E]"
            />
          </button>
        </div>
      </section>

      {/* Table */}
      <section className="w-full h-full overflow-x-auto border-none mt-4 pb-4">
        <table className="w-full text-left border-collapse table-row">
          <thead className="sticky top-0 z-10 w-full">
            <tr className="bg-primary text-neutral-white -translate-y-1">
              <th className="py-3 px-10 whitespace-nowrap w-20"></th>
              <th className="px-4 py-3 w-80 min-w-80 whitespace-nowrap label-large-emphasized">
                ชื่อ-นามสกุล
              </th>
              <th className="px-4 py-3 w-40 min-w-40 whitespace-nowrap label-large-emphasized">
                รหัสประจำตัว
              </th>
              {/* type filter */}
              <TableFilterPopover
                options={typeOptions}
                selectedValues={typeFilter}
                onChange={setTypeFilter}
                className="w-32 min-w-32"
              >
                ประเภท
              </TableFilterPopover>
              {/* faculty filter */}
              <TableFilterPopover
                options={facultyOptions}
                selectedValues={facultyFilter}
                onChange={setFacultyFilter}
                className="w-72 min-w-64"
              >
                คณะ/หน่วยงาน
              </TableFilterPopover>

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

                  <DropdownMenuContent
                    align="start"
                    className="py-2 px-0 w-60 shadow-elevation-2"
                  >
                    <DropdownMenuItem
                      className={cn(
                        "rounded-none px-4",
                        sortDirection === "desc" &&
                          "font-bold bg-neutral-200 hover:bg-neutral-200",
                      )}
                      onClick={() =>
                        setSortDirection((prev) =>
                          prev === "desc" ? null : "desc",
                        )
                      }
                    >
                      <div className={cn("body-large-primary")}>
                        ลงทะเบียนล่าสุด
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className={cn(
                        "rounded-none px-4",
                        sortDirection === "asc" &&
                          "font-bold bg-neutral-200 hover:bg-neutral-500",
                      )}
                      onClick={() =>
                        setSortDirection((prev) =>
                          prev === "asc" ? null : "asc",
                        )
                      }
                    >
                      <div className={cn("body-large-primary")}>
                        ลงทะเบียนแรกสุด
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </th>

              <TableFilterPopover
                options={statusOptions}
                selectedValues={statusFilter}
                onChange={setStatusFilter}
                displayLabelMap={STATUS_LABEL_MAP}
                className="w-52 min-w-52"
              >
                สถานะการลงทะเบียน
              </TableFilterPopover>

              <th className="px-4 py-3 whitespace-nowrap label-large-emphasized w-full min-w-xl">
                หมายเหตุ
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <RegistrationTableRow
                key={`${item.id}-${index}`}
                item={item}
                index={(currentPage - 1) * itemsPerPage + index}
              />
            ))}
          </tbody>
        </table>
      </section>

      {/* --- ส่วน Footer --- */}
      <footer className="w-full flex flex-col md:flex-row justify-between gap-4 mt-0 md:mt-4">
        <p className="label-large-primary text-neutral-600">
          แสดงผลลัพธ์ {startResult} ถึง {endResult} จาก {totalItems} รายการ
        </p>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </footer>
    </div>
  );
};
