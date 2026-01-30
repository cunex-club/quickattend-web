"use client";

import { useState } from "react";
import EventCard from "@modules/events/main-page/components/event-card";
import SortMenu from "@modules/events/main-page/components/sort-menu";
import FilterMenu, {
  FilterValues,
} from "@modules/events/main-page/components/filter-menu";
import Pagination from "@shared/Pagination";
import { useTranslations } from "next-intl";

import { Link } from "@i18n/navigation";
import IonIcon from "@shared/IonIcon";

const EventPageTemplate = () => {
  const t = useTranslations("Events");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // TODO: Replace with actual total pages from API

  const handleMyEventsFilterChange = (values: FilterValues) => {
    console.log("กิจกรรมของฉัน filter:", {
      accessRights: values.accessRights,
      date: values.date?.toLocaleDateString("th-TH"),
    });
  };

  const handleMyEventsSortChange = (value: string) => {
    setSortOrder(value);
    console.log("กิจกรรมของฉัน sort:", value);
  };

  const handlePastEventsFilterChange = (values: FilterValues) => {
    console.log("กิจกรรมที่ผ่านมา filter:", {
      accessRights: values.accessRights,
      date: values.date?.toLocaleDateString("th-TH"),
    });
  };

  const handlePastEventsSortChange = (value: string) => {
    console.log("กิจกรรมที่ผ่านมา sort:", value);
  };

  return (
    <div className="w-full h-full px-6 py-8 lg:px-24 lg:py-24 pb-30 space-y-8 lg:space-y-16">
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="headline-small-emphasized lg:display-medium-emphasized">
            {t("myEvents")}
          </div>
          <Link href="/search" className="lg:hidden text-primary p-1">
            <IonIcon name="SearchOutline" className="w-6 h-6" />
          </Link>
        </div>
        <EventCard
          title="Freshmen night"
          description="กิจกรรมต้อนรับนิสิตใหม่ CU รุ่น 109 สู่รั้วมหาวิทยาลัย และ
            กระชับสัมพันธ์ อันดีระหว่างน้องใหม่คณะต่างๆภาย ในงานมีการจัด
            แสดงดนตรีโดยวงดนตรี อาทิเช่น Landokmai, Dept, Polycat, Tilly Birds,
            การแสดง พิเศษจาก CUDC และละครนิเทศ จุฬาฯ"
          date="3 สิงหาคม 2568"
          time="16:00 - 20:00 น."
          location="สนามกีฬาจุฬาลงกรณ์มหาวิทยาลัย"
          role="Owner"
          isEnd={false}
        />
      </div>
      <div className="space-y-8">
        <div className="flex justify-between items-center gap-4">
          <div className="headline-small-emphasized lg:display-medium-emphasized">
            {t("pastEvents")}
          </div>
          <div className="flex flex-wrap items-center gap-1 lg:gap-2.25">
            <FilterMenu onFilterChange={handlePastEventsFilterChange} />
            <SortMenu
              options={[
                {
                  label: "วันที่จัดกิจกรรม : ใหม่สุด - เก่าสุด",
                  value: "newest",
                },
                {
                  label: "วันที่จัดกิจกรรม : เก่าสุด - ใหม่สุด",
                  value: "oldest",
                },
              ]}
              onSelect={handlePastEventsSortChange}
            />
          </div>
        </div>
        <EventCard
          title="Freshmen night"
          description="กิจกรรมต้อนรับนิสิตใหม่ CU รุ่น 109 สู่รั้วมหาวิทยาลัย และ
            กระชับสัมพันธ์ อันดีระหว่างน้องใหม่คณะต่างๆภาย ในงานมีการจัด
            แสดงดนตรีโดยวงดนตรี อาทิเช่น Landokmai, Dept, Polycat, Tilly Birds,
            การแสดง พิเศษจาก CUDC และละครนิเทศ จุฬาฯ"
          date="3 สิงหาคม 2568"
          time="16:00 - 20:00 น."
          location="สนามกีฬาจุฬาลงกรณ์มหาวิทยาลัย"
          role="Owner"
          isEnd
        />
      </div>
      <div className="flex justify-center pt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default EventPageTemplate;
