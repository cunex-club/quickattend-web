"use client";
import { useState } from "react";
import IonIcon from "@shared/IonIcon";
import Link from "next/dist/client/link";
// import { useTranslations } from "next-intl";
import { Button } from "@assets/components/ui/button";
import SearchBar from "../DashboardSearchBar";
import Pagination from "@shared/Pagination";

const MOCK_DATA = [
  {
    id: "6521008721",
    name: "นายศตฤทธิ์ ศรเนือง",
    avatar: "https://i.pravatar.cc/150?img=11",
    type: "นิสิต",
    faculty: "คณะวิศวกรรมศาสตร์",
    time: "13:00:59",
    status: "success",
    remark: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    id: "6521008721",
    name: "นายศตฤทธิ์ ศรเนือง",
    avatar: "https://i.pravatar.cc/150?img=12",
    type: "บุคลากร",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    time: "13:00:59",
    status: "failed",
    remark: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    id: "6521008721",
    name: "นายศตฤทธิ์ ศรเนือง",
    avatar: "https://i.pravatar.cc/150?img=13",
    type: "นิสิต",
    faculty: "สถาบันวิจัยเทคโนโลยีชีวภาพและ...",
    time: "13:00:59",
    status: "warning",
    remark: "",
  },
  {
    id: "6521008721",
    name: "นายศตฤทธิ์ ศรเนือง",
    avatar: "https://i.pravatar.cc/150?img=14",
    type: "นิสิต",
    faculty: "คณะวิศวกรรมศาสตร์",
    time: "13:00:59",
    status: "success",
    remark:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    id: "6521008721",
    name: "นายศตฤทธิ์ ศรเนือง",
    avatar: "https://i.pravatar.cc/150?img=15",
    type: "นิสิต",
    faculty: "คณะวิทยาศาสตร์",
    time: "13:00:59",
    status: "success",
    remark: "Lorem ipsum dolor sit amet, consectetur",
  },
  {
    id: "6521008721",
    name: "นายศตฤทธิ์ ศรเนือง",
    avatar: "https://i.pravatar.cc/150?img=11",
    type: "นิสิต",
    faculty: "คณะวิศวกรรมศาสตร์",
    time: "13:00:59",
    status: "success",
    remark: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    id: "6521008721",
    name: "นายศตฤทธิ์ ศรเนือง",
    avatar: "https://i.pravatar.cc/150?img=12",
    type: "บุคลากร",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    time: "13:00:59",
    status: "failed",
    remark: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    id: "6521008721",
    name: "นายศตฤทธิ์ ศรเนือง",
    avatar: "https://i.pravatar.cc/150?img=13",
    type: "นิสิต",
    faculty: "สถาบันวิจัยเทคโนโลยีชีวภาพและ",
    time: "13:00:59",
    status: "warning",
    remark: "",
  },
  {
    id: "6521008721",
    name: "นายศตฤทธิ์ ศรเนือง",
    avatar: "https://i.pravatar.cc/150?img=14",
    type: "นิสิต",
    faculty: "คณะวิศวกรรมศาสตร์",
    time: "13:00:59",
    status: "success",
    remark: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    id: "6521008721",
    name: "นายศตฤทธิ์ ศรเนือง",
    avatar: "https://i.pravatar.cc/150?img=15",
    type: "นิสิต",
    faculty: "คณะวิทยาศาสตร์",
    time: "13:00:59",
    status: "success",
    remark: "Lorem ipsum dolor sit amet, consectetur",
  },
];

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

export const RegistrationView = () => {
  const [expandedRemarks, setExpandedRemarks] = useState<number[]>([]);
  const toggleRemark = (index: number) => {
    setExpandedRemarks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };
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
        <table className="w-full min-w-[1000px] text-left border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#DE5C8E] text-white -translate-y-1">
              <th className="py-3 whitespace-nowrap label-large-emphasized min-w-14">
                {/* blank */}
              </th>
              <th className="px-4 py-3 min-w-56 md:min-w-64 whitespace-nowrap label-large-emphasized">
                ชื่อ-นามสกุล
              </th>
              <th className="px-4 py-3 whitespace-nowrap label-large-emphasized">
                รหัสประจำตัว
              </th>
              <th className="px-4 py-3 whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex flex-row items-center justify-between gap-2 label-large-emphasized w-full">
                  <p className="label-large-emphasized">ประเภท</p>
                  <div>
                    <IonIcon name="FilterOutline" size="18px" />
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex flex-row items-center justify-between gap-2 label-large-emphasized w-full">
                  <p className="label-large-emphasized">คณะ/หน่วยงาน</p>
                  <div>
                    <IonIcon name="FilterOutline" size="18px" />
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex flex-row items-center justify-between gap-2 label-large-emphasized">
                  <p className="label-large-emphasized">เวลา</p>
                  <div>
                    <IonIcon name="SwapVerticalOutline" size="18px" />
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 w-30 whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex flex-row items-center justify-between gap-2 label-large-emphasized">
                  สถานะการลงทะเบียน
                  <div>
                    <IonIcon name="FilterOutline" size="18px" />
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 whitespace-nowrap label-large-emphasized">
                หมายเหตุ
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DATA.map((item, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 hover:bg-gray-50 title-medium-primary text-neutral-500 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-[#F8F9FA]"
                }`}
              >
                <td className="whitespace-nowrap flex flex-row justify-center items-center justify-self-center mt-2">
                  {item.avatar && (
                    <img
                      src={item.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{item.name}</td>
                <td className="px-4 py-3 whitespace-nowrap min-w-32">
                  {item.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap min-w-20 w-20 text-center">
                  {item.type}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{item.faculty}</td>
                <td className="px-4 py-3 whitespace-nowrap min-w-24">
                  {item.time}
                </td>
                <td className="px-4 py-3 whitespace-nowrap flex flex-row justify-center items-center">
                  {renderStatusBadge(item.status)}
                </td>
                <td
                  className={`px-4 py-3 max-w-64 cursor-pointer transition-all duration-300 ${
                    expandedRemarks.includes(index)
                      ? "whitespace-nowrap max-w-none"
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
