import { useTranslations } from "next-intl";
import { AttendanceType, EventFormInterface, Student } from "../template";
import { RadioGroup, RadioGroupItem } from "@assets/components/ui/radio-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@assets/components/ui/command";
import { useEffect, useState } from "react";
import { Input } from "@assets/components/ui/input";
import Button from "@shared/Button";
import IonIcon from "@shared/IonIcon";

const MOCK_STUDENTNAME = "นางสาวปริณ ไกรภพ";
interface CreateEventStep2Props {
  eventForm: EventFormInterface;
  setEventForm: (formdata: EventFormInterface) => void;
}

export const FacultyList: string[] = [
  "คณะครุศาสตร์",
  "คณะจิตวิทยา",
  "คณะทันตแพทยศาสตร์",
  "คณะนิติศาสตร์",
  "คณะนิเทศศาสตร์",
  "คณะพยาบาลศาสตร์",
  "คณะพาณิชยศาสตร์และการบัญชี",
  "คณะแพทยศาสตร์",
  "คณะเภสัชศาสตร์",
  "คณะรัฐศาสตร์",
  "คณะวิทยาศาสตร์",
  "คณะวิทยาศาสตร์การกีฬา",
  "คณะวิศวกรรมศาสตร์",
  "คณะศิลปกรรมศาสตร์",
  "คณะสถาปัตยกรรมศาสตร์",
  "คณะสหเวชศาสตร์",
  "คณะสัตวแพทยศาสตร์",
  "คณะอักษรศาสตร์",
  "คณะเศรษฐศาสตร์",
  "จุฬาลงกรณ์มหาวิทยาลัย",
  "บัณฑิตวิทยาลัย",
  "วิทยาลัยประชากรศาสตร์",
  "วิทยาลัยปิโตรเลียมและปิโตรเคมี",
  "วิทยาลัยวิทยาศาสตร์สาธารณสุข",
  "ศูนย์การจัดการทรัพยากรของมหาวิทยาลัย",
  "ศูนย์การศึกษาทั่วไป",
  "ศูนย์กีฬาแห่งจุฬาลงกรณ์มหาวิทยาลัย",
  "ศูนย์ความเป็นเลิศด้านเทคโนโลยีปิโตรเคมีและวัสดุ",
  "ศูนย์ความปลอดภัย อาชีวอนามัยและสิ่งแวดล้อม จุฬาลงกรณ์มหาวิทยาลัย",
  "ศูนย์จุฬาฯ-ชนบท",
  "ศูนย์เชี่ยวชาญไฟฟ้ากำลัง",
  "ศูนย์ทดสอบทางวิชาการแห่งจุฬาลงกรณ์มหาวิทยาลัย",
  "ศูนย์นวัตกรรมการเรียนรู้",
  "ศูนย์บริหารกลาง",
  "ศูนย์บริหารความเสี่ยง",
  "ศูนย์บริการสุขภาพแห่งจุฬาลงกรณ์มหาวิทยาลัย",
  "ศูนย์บริการวิชาการแห่งจุฬาลงกรณ์มหาวิทยาลัย",
  "ศูนย์พัฒนกิจและนิสิตเก่าสัมพันธ์",
  "ศูนย์รักษาความปลอดภัยและจัดการจราจรแห่งจุฬาลงกรณ์มหาวิทยาลัย",
  "ศูนย์ระดับภูมิภาคทางวิศวกรรม",
  "ศูนย์วิทยาศาสตร์ฮาลาล จุฬาลงกรณ์มหาวิทยาลัย",
  "ศูนย์วิเคราะห์รายได้และปฏิบัติการลงทุน",
  "ศูนย์สัตว์ทดลอง จุฬาลงกรณ์มหาวิทยาลัย",
  "ศูนย์สื่อสารองค์กร",
  "ศูนย์หนังสือแห่งจุฬาลงกรณ์มหาวิทยาลัย",
  "ศูนย์เครือข่ายการเรียนรู้เพื่อภูมิภาค จุฬาลงกรณ์มหาวิทยาลัย",
  "ศูนย์เครื่องมือวิจัยวิทยาศาสตร์และเทคโนโลยี จุฬาลงกรณ์มหาวิทยาลัย",
  "ศูนย์กลางนวัตกรรมแห่งจุฬาลงกรณ์มหาวิทยาลัย",
  "สถาบันการขนส่ง",
  "สถาบันขงจื่อแห่งจุฬาลงกรณ์มหาวิทยาลัย",
  "สถาบันนวัตกรรมบูรณาการแห่งจุฬาลงกรณ์มหาวิทยาลัย",
  "สถาบันบัณฑิตบริหารธุรกิจ ศศินทร์ แห่งจุฬาลงกรณ์มหาวิทยาลัย",
  "สถาบันภาษา",
  "สถาบันภาษาไทยสิรินธรแห่งจุฬาลงกรณ์มหาวิทยาลัย",
  "สถาบันวิจัยทรัพยากรทางน้ำ",
  "สถาบันวิจัยพลังงาน",
  "สถาบันวิจัยสังคม",
  "สถาบันวิจัยสิ่งแวดล้อมเพื่อความยั่งยืน",
  "สถาบันวิจัยเทคโนโลยีชีวภาพและวิศวกรรมพันธุศาสตร์",
  "สถาบันวิจัยโลหะและวัสดุ",
  "สถาบันเอเชียศึกษา",
  "สถาบันไทยศึกษา",
  "สภาคณาจารย์",
  "สำนักกฎหมายและนิติการ",
  "สำนักกิจการวุฒยาจารย์",
  "สำนักตรวจสอบ",
  "สำนักบริหารกิจการนิสิต",
  "สำนักบริหารการเงิน การบัญชี และการพัสดุ",
  "สำนักบริหารทรัพยากรมนุษย์",
  "สำนักบริหารระบบกายภาพ",
  "สำนักบริหารวิชาการ",
  "สำนักบริหารวิจัย",
  "สำนักบริหารวิรัชกิจและเครือข่ายนานาชาติ",
  "สำนักบริหารศิลปวัฒนธรรม",
  "สำนักบริหารเทคโนโลยีสารสนเทศ",
  "สำนักบริหารแผนและการงบประมาณ",
  "สำนักพิมพ์แห่งจุฬาลงกรณ์มหาวิทยาลัย",
  "สำนักยุทธศาสตร์และการขับเคลื่อน",
  "สำนักวิชาทรัพยากรการเกษตร",
  "สำนักงานการทะเบียน",
  "สำนักงานจัดการทรัพย์สิน",
  "สำนักงานมหาวิทยาลัย",
  "สำนักงานวิทยทรัพยากร",
  "สำนักงานสภามหาวิทยาลัย",
];

const CreateEventStep2 = ({
  eventForm,
  setEventForm,
}: CreateEventStep2Props) => {
  const tCreateEvent = useTranslations("CreateEvent");

  const [facultyQuery, setFacultyQuery] = useState("");
  const [studentIdQuery, setStudentIdQuery] = useState("");
  const [filteredFaculties, setFilteredOrganization] = useState<string[]>([]);

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const [openFacultyFilter, setOpenFacultyFilter] = useState(false);

  useEffect(() => {
    if (!facultyQuery) {
      setFilteredOrganization([]);
      setOpenFacultyFilter(false);
      return;
    }
    const filtered = FacultyList.filter((org) => org.includes(facultyQuery));
    setFilteredOrganization(filtered);
    setOpenFacultyFilter(true);
  }, [facultyQuery]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="title-large-emphasized mb-4 text-center">
        {tCreateEvent("setting")}
      </h1>

      {/* Accessibility */}
      <div className="flex flex-col gap-2">
        <p className="title-large-emphasized mb-4">
          {tCreateEvent("access")} <span className="text-primary">*</span>
        </p>

        <RadioGroup
          defaultValue={eventForm.attendance_type}
          onValueChange={(value: AttendanceType) => {
            setEventForm({
              ...eventForm,
              attendance_type: value,
            });
          }}
          className="w-full flex flex-col gap-6"
        >
          {/* All */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-4">
              <RadioGroupItem
                value={AttendanceType.ALL}
                id={AttendanceType.ALL}
                className="cursor-pointer"
              />
              <label
                htmlFor={AttendanceType.ALL}
                className="label-large-primary cursor-pointer"
              >
                {tCreateEvent("all")}
              </label>
            </div>
          </div>

          {/* Faculties */}
          <div className="flex flex-col gap-4">
            {/* Radio Button */}
            <div className="flex items-center space-x-4">
              <RadioGroupItem
                value={AttendanceType.FACULTIES}
                id={AttendanceType.FACULTIES}
                className="cursor-pointer"
              />
              <label
                htmlFor={AttendanceType.FACULTIES}
                className="label-large-primary cursor-pointer"
              >
                {tCreateEvent("faculties")}
              </label>
            </div>

            {/* Faculty Input */}
            <div className="flex gap-4 flex-wrap w-full">
              <div className="flex flex-col gap-2 flex-1">
                <Input
                  value={facultyQuery}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^[\u0E00-\u0E7F]*$/.test(value)) {
                      setFacultyQuery(e.target.value);
                      setOpenFacultyFilter(true);
                    }
                  }}
                  disabled={
                    eventForm.attendance_type != AttendanceType.FACULTIES
                  }
                  placeholder={tCreateEvent("facultiesPlaceholder")}
                  className="w-full"
                />
                {openFacultyFilter && (
                  <Command>
                    <CommandList>
                      {filteredFaculties?.length === 0 && (
                        <CommandEmpty>
                          {tCreateEvent("facultiesNotFound")}
                        </CommandEmpty>
                      )}

                      {facultyQuery && (
                        <CommandGroup>
                          {filteredFaculties?.map((f) => (
                            <CommandItem
                              key={f}
                              value={f}
                              onSelect={(value) => {
                                setOpenFacultyFilter(false);
                                setFacultyQuery(value);
                              }}
                            >
                              {f}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                )}
              </div>
              <Button
                mode="filled"
                bordered="square"
                expanded={false}
                className={`h-9 shrink-0 ${
                  eventForm.attendance_type == AttendanceType.FACULTIES &&
                  FacultyList.includes(facultyQuery) &&
                  !eventForm.selectedFaculties.includes(facultyQuery)
                    ? "cursor-pointer"
                    : "cursor-default border-neutral-400 text-neutral-400 bg-transparent"
                }`}
                onClick={() => {
                  if (eventForm.attendance_type != AttendanceType.FACULTIES)
                    return;
                  const selectedFaculties = eventForm.selectedFaculties;
                  if (!FacultyList.includes(facultyQuery)) return;
                  if (selectedFaculties.includes(facultyQuery)) return;

                  setEventForm({
                    ...eventForm,
                    selectedFaculties: [
                      ...selectedFaculties,
                      facultyQuery,
                    ].sort((a, b) => a.localeCompare(b, "th")),
                  });

                  setFacultyQuery("");
                }}
              >
                <p className="label-large-primary -translate-y-0.5">
                  {tCreateEvent("facultiesAdd")}
                </p>
              </Button>
            </div>

            {/* Faculty List */}
            {eventForm.selectedFaculties.map((faculty) => (
              <div
                key={faculty}
                className={`flex items-center gap-2 border rounded-md px-3 py-2 ${eventForm.attendance_type != AttendanceType.FACULTIES && "opacity-50"}`}
              >
                {/* Remove */}
                <button
                  type="button"
                  disabled={
                    eventForm.attendance_type != AttendanceType.FACULTIES
                  }
                  onClick={() => {
                    if (eventForm.attendance_type != AttendanceType.FACULTIES)
                      return;

                    const newFaculties = eventForm.selectedFaculties
                      .filter((item) => item !== faculty)
                      .sort((a, b) => a.localeCompare(b, "th"));

                    setEventForm({
                      ...eventForm,
                      selectedFaculties: newFaculties,
                    });
                  }}
                  className={`${eventForm.attendance_type == AttendanceType.FACULTIES ? "text-primary" : "text-neutral-500"}`}
                >
                  <IonIcon name="RemoveCircleOutline" size="18px" />
                </button>

                <p className="body-large-primary">{faculty}</p>
              </div>
            ))}
          </div>

          {/* Whitelist */}
          <div className="flex flex-col gap-4">
            {/* Radio Button */}
            <div className="flex items-center space-x-4">
              <RadioGroupItem
                value={AttendanceType.WHITELIST}
                id={AttendanceType.WHITELIST}
                className="cursor-pointer"
              />
              <label
                htmlFor={AttendanceType.WHITELIST}
                className="label-large-primary cursor-pointer"
              >
                {tCreateEvent("whitelist")}
              </label>
            </div>

            {/* Individual Input */}
            <div className="flex gap-4 flex-wrap w-full">
              <div className="flex flex-col gap-2 flex-1">
                <Input
                  inputMode="numeric"
                  maxLength={10}
                  value={studentIdQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      setStudentIdQuery(value);
                    }
                  }}
                  disabled={
                    eventForm.attendance_type != AttendanceType.WHITELIST
                  }
                  placeholder={tCreateEvent("whitelistPlaceholder")}
                />
              </div>
              <Button
                mode="filled"
                bordered="square"
                expanded={false}
                className={`h-9 shrink-0 ${
                  eventForm.attendance_type == AttendanceType.WHITELIST &&
                  studentIdQuery?.length == 10 &&
                  !selectedStudentIds?.includes(studentIdQuery)
                    ? "cursor-pointer"
                    : "cursor-default border-neutral-400 text-neutral-400 bg-transparent"
                }`}
                onClick={() => {
                  if (eventForm.attendance_type != AttendanceType.WHITELIST)
                    return;

                  if (studentIdQuery.length != 10) return;
                  if (selectedStudentIds?.includes(studentIdQuery)) return;

                  // =====
                  // TODO: Fetch Student Name from Student Id
                  // =====

                  const student: Student = {
                    id: studentIdQuery,
                    name: MOCK_STUDENTNAME,
                  };

                  setEventForm({
                    ...eventForm,
                    selectedStudents: [
                      ...eventForm.selectedStudents,
                      student,
                    ].sort((a, b) => {
                      return Number(a.id) - Number(b.id);
                    }),
                  });

                  setSelectedStudentIds((prev) => [...prev, studentIdQuery]);
                  setStudentIdQuery("");
                }}
              >
                <p className="label-large-primary -translate-y-0.5">
                  {tCreateEvent("whitelistAdd")}
                </p>
              </Button>
            </div>

            {/* Individual List */}
            {eventForm.selectedStudents.map((student) => (
              <div
                key={student.id}
                className={`flex items-center gap-2 border rounded-md px-3 py-2 ${eventForm.attendance_type != AttendanceType.WHITELIST && "opacity-50"}`}
              >
                {/* Remove */}
                <button
                  type="button"
                  disabled={
                    eventForm.attendance_type != AttendanceType.WHITELIST
                  }
                  onClick={() => {
                    if (eventForm.attendance_type != AttendanceType.WHITELIST)
                      return;

                    const newStudents = eventForm.selectedStudents
                      .filter((s) => s.id !== student.id)
                      .sort((a, b) => {
                        return Number(a.id) - Number(b.id);
                      });

                    setEventForm({
                      ...eventForm,
                      selectedStudents: newStudents,
                    });

                    setSelectedStudentIds((prev) => {
                      return prev.filter((id) => id != student.id);
                    });
                  }}
                  className={`${eventForm.attendance_type == AttendanceType.WHITELIST ? "text-primary" : "text-neutral-500"}`}
                >
                  <IonIcon name="RemoveCircleOutline" size="18px" />
                </button>

                <p className="body-large-primary">
                  {student.id} {student.name}
                </p>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default CreateEventStep2;
