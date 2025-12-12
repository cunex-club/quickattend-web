import Icon from "@shared/Icon";
import EventCard from "@modules/events/main-page/components/event-card";
import { Link } from "@i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@assets/components/ui/dropdown-menu";

const EventPageTemplate = () => {
  return (
    <div className="w-full h-full px-24 py-24 pb-30 space-y-16">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="title-small-primary md:hidden">กิจกรรมของฉัน</div>
          <div className="hidden md:block display-medium-emphasized">กิจกรรมของฉัน</div>
          <div className="flex gap-2.25">
            <Link href="/events/search">
              <Icon name="Search" size={24} className="m-2.5 text-primary" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Sort"
                  className="m-2.5 text-primary cursor-pointer rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <Icon name="Sort" size={24} className="text-primary" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="py-2">
                <DropdownMenuItem><div className="body-small-primary">วันที่จัดกิจกรรม : ใหม่สุด - เก่าสุด</div></DropdownMenuItem>
                <DropdownMenuItem><div className="body-small-primary">วันที่จัดกิจกรรม : เก่าสุด - ใหม่สุด</div></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          isEnd={false}
        />
      </div>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="display-medium-emphasized">กิจกรรมที่ผ่านมา</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Sort"
                className="m-2.5 text-primary cursor-pointer rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <Icon name="Sort" size={24} className="text-primary" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>แรกที่สุดก่อน OR</DropdownMenuItem>
              <DropdownMenuItem>แรกสุดที่</DropdownMenuItem>
              <DropdownMenuItem>ทำซ้ำกิจกรรม</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
    </div>
  );
};

export default EventPageTemplate;
