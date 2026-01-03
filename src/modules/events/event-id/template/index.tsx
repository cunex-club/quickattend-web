"use client";

import { useState } from "react";
import IonIcon from "@shared/IonIcon";
import Icon from "@shared/Icon";
import Button from "@shared/Button";
import ShareModal from "../components/shareModal";

const EventIdPageTemplate = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div className="w-full flex flex-col justify-center items-center px-25 pt-35 gap-7.5">
      <div className="w-full flex flex-row gap-10">
        <div className="flex-4 bg-neutral-100 p-10 space-y-5 rounded-3xl shadow-xs">
          <div className="flex w-full items-center justify-between">
            <div className="display-medium-emphasized ">Freshmen night</div>
            <div>
              <Icon name="edit" size={32} className="text-primary" />
            </div>
          </div>
          <div>
            <div className="flex gap-2 items-center">
              <IonIcon name="Calendar" size="16px" className="text-secondary" />
              <div className="body-large-primary">3 สิงหาคม 2568</div>
            </div>
            <div className="flex gap-2 items-center">
              <IonIcon name="Time" size="16px" className="text-secondary" />
              <div className="body-large-primary">16:00 - 20:00 น.</div>
            </div>
            <div className="flex gap-2 items-center">
              <IonIcon name="Location" size="16px" className="text-secondary" />
              <div className="body-large-primary">
                สนามกีฬาจุฬาลงกรณ์มหาวิทยาลัย
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <IonIcon name="Person" size="16px" className="text-secondary" />
              <div className="body-large-primary">Owner</div>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="headline-small-emphasized">รายละเอียดกิจกรรม</div>
            <div className="body-large-primary">
              กิจกรรมต้อนรับนิสิตใหม่ CU รุ่น 109 สู่รั้วมหาวิทยาลัย และ
              กระชับสัมพันธ์ อันดีระหว่างน้องใหม่คณะต่างๆภาย ในงานมีการจัด
              แสดงดนตรีโดยวงดนตรี อาทิเช่น Landokmai, Dept, Polycat, Tilly
              Birds, การแสดง พิเศษจาก CUDC และละครนิเทศ จุฬาฯ
            </div>
          </div>
          <div>
            <div className="headline-small-emphasized">กำหนดการกิจกรรม</div>
            <div className="body-large-primary">
              <div className="flex w-full justify-between">
                <div>การแสดงพิเศษจาก CUDC</div>
                <div>16:00 - 16:30 น.</div>
              </div>
              <div className="flex w-full justify-between">
                <div>การแสดงพิเศษจาก CUDC</div>
                <div>16:00 - 16:30 น.</div>
              </div>
              <div className="flex w-full justify-between">
                <div>การแสดงพิเศษจาก CUDC</div>
                <div>16:00 - 16:30 น.</div>
              </div>
              <div className="flex w-full justify-between">
                <div>การแสดงพิเศษจาก CUDC</div>
                <div>16:00 - 16:30 น.</div>
              </div>
              <div className="flex w-full justify-between">
                <div>การแสดงพิเศษจาก CUDC</div>
                <div>16:00 - 16:30 น.</div>
              </div>
              <div className="flex w-full justify-between">
                <div>การแสดงพิเศษจาก CUDC</div>
                <div>16:00 - 16:30 น.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between gap-10">
          <div className="flex flex-col justify-center items-center bg-primary h-full p-10 text-white rounded-3xl shadow-xs">
            <div className="headline-small-emphasized">จำนวนผู้ลงทะเบียน</div>
            <div className="flex items-baseline gap-2">
              <div
                className="text-center"
                style={{
                  color: "var(--Color-Neutral-White, #FFF)",
                  fontFamily:
                    "CHULALONGKORNBold, var(--font-chula-bold), sans-serif",
                  fontSize: "72px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "140%",
                  letterSpacing: "-0.792px",
                }}
              >
                240
              </div>
              <div className="title-large-primary">คน</div>
            </div>
            <div className="flex space-x-2.5 title-small-primary">
              <div>นิสิต : 1090 คน</div>
              <div>|</div>
              <div>บุคลากร : 6 คน</div>
            </div>
          </div>
          <div className="bg-neutral-100 p-5 rounded-3xl shadow-xs">
            <div className="headline-small-emphasized">กิจกรรมโดย</div>
            <div className="body-large-primary">
              นายคหฤทธิ์ ครเนือง ณ อยุธยา
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-6">
        <Button mode="filled" bordered="round" expanded={true}>
          <div className="flex justify-center items-center gap-2 text-neutral-white">
            <IonIcon name="Scan" size="36px" />
            <div className="title-large-primary">สแกนผู้เข้าร่วมกิจกรรม</div>
          </div>
        </Button>
        <Button mode="outline" bordered="round" expanded={true}>
          <div className="flex justify-center text-primary items-center gap-2">
            <IonIcon name="TrendingUp" size="36px" />
            <div className="title-large-primary">สถิติกิจกรรม</div>
          </div>
        </Button>
        <div className="flex gap-2">
          <Button mode="outline" bordered="round" expanded={false}>
            <IonIcon
              name="DuplicateOutline"
              size="36px"
              className="text-primary"
            />
          </Button>
          <Button 
            mode="outline" 
            bordered="round" 
            expanded={false}
            onClick={() => setIsShareModalOpen(true)}
          >
            <IonIcon
              name="ArrowRedoOutline"
              size="36px"
              className="text-primary"
            />
          </Button>
        </div>
      </div>

      <ShareModal 
        open={isShareModalOpen} 
        onOpenChange={setIsShareModalOpen} 
      />
    </div>
  );
};

export default EventIdPageTemplate;
