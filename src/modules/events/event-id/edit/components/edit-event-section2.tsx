import { Checkbox } from "@assets/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@assets/components/ui/command";
import { Input } from "@assets/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@assets/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@assets/components/ui/select";
import {
  FacultyEnByTh,
  FacultyList,
  filterFacultyOptions,
} from "@utils/faculty";
import {
  AttendanceType,
  EventFormInterface,
  EventManager,
  EventManagerType,
  ParticipantFieldType,
  ScanPermissionType,
  Student,
} from "@modules/events/create/types";
import Button from "@shared/Button";
import IonIcon from "@shared/IonIcon";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface EditEventSection1Props {
  eventForm: EventFormInterface;
  setEventForm: (formdata: EventFormInterface) => void;
}

const EditEventSection2 = ({
  eventForm,
  setEventForm,
}: EditEventSection1Props) => {
  const tEditEvent = useTranslations("EditEvent");
  const locale = useLocale();

  const [facultyQuery, setFacultyQuery] = useState("");
  const [studentIdPermissionQuery, setStudentIdPermissionQuery] = useState("");
  const [studentIdAccessibilityQuery, setStudentIdAccessibilityQuery] =
    useState("");
  const [roleAccessibilityQuery, setRoleAccessibilityQuery] = useState<
    EventManagerType | ""
  >("");

  const [filteredFaculties, setFilteredOrganization] = useState<string[]>([]);

  const [selectedStudentIdsPermission, setSelectedStudentIdsPermission] =
    useState<string[]>([]);

  const [selectedStudentIdsAccessibility, setSelectedStudentIdsAccessibility] =
    useState<string[]>([]);

  const [openFacultyFilter, setOpenFacultyFilter] = useState(false);

  useEffect(() => {
    if (!facultyQuery) {
      setFilteredOrganization([]);
      setOpenFacultyFilter(false);
      return;
    }
    const filtered = filterFacultyOptions(facultyQuery);
    setFilteredOrganization(filtered);
    setOpenFacultyFilter(true);
  }, [facultyQuery]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="title-large-emphasized text-primary">
        {tEditEvent("setting")}
      </h1>

      {/* Permission */}
      <div className="flex flex-col gap-2">
        <p className="title-large-emphasized mb-4">
          {tEditEvent("permission")} <span className="text-primary">*</span>
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
                className="body-large-primary cursor-pointer"
              >
                {tEditEvent(AttendanceType.ALL)}
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
                className="body-large-primary cursor-pointer"
              >
                {tEditEvent(AttendanceType.FACULTIES)}
              </label>
            </div>

            {/* Faculty Input */}
            <div className="flex gap-4 flex-col sm:flex-row w-full">
              <div className="flex flex-col gap-2 flex-1">
                <Input
                  value={facultyQuery}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^[\u0E00-\u0E7Fa-zA-Z\s]*$/.test(value)) {
                      setFacultyQuery(value);
                      setOpenFacultyFilter(true);
                    }
                  }}
                  disabled={
                    eventForm.attendance_type != AttendanceType.FACULTIES
                  }
                  placeholder={tEditEvent("facultiesPlaceholder")}
                  className="body-large-primary"
                />
                {openFacultyFilter && (
                  <Command>
                    <CommandList>
                      {filteredFaculties?.length === 0 && (
                        <CommandEmpty className="body-large-primary">
                          {tEditEvent("facultiesNotFound")}
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
                              className="body-large-primary"
                            >
                              {locale === "en" ? (FacultyEnByTh[f] ?? f) : f}
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
                disabled={
                  eventForm.attendance_type != AttendanceType.FACULTIES ||
                  !FacultyList.includes(facultyQuery) ||
                  eventForm.selectedFaculties.includes(facultyQuery)
                }
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
                <p className="label-large-primary -translate-y-1">
                  {tEditEvent("facultiesAdd")}
                </p>
              </Button>
            </div>

            {/* Faculty List */}
            {eventForm.selectedFaculties.map((faculty) => (
              <div
                key={faculty}
                className={`flex items-center gap-2 border-b-2 py-2 ${eventForm.attendance_type != AttendanceType.FACULTIES && "opacity-50"}`}
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
                  className={`${eventForm.attendance_type == AttendanceType.FACULTIES ? "text-primary cursor-pointer" : "text-neutral-500"}`}
                >
                  <IonIcon name="RemoveCircleOutline" size="18px" />
                </button>

                <p className="body-large-primary">
                  {locale === "en"
                    ? (FacultyEnByTh[faculty] ?? faculty)
                    : faculty}
                </p>
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
                className="body-large-primary cursor-pointer"
              >
                {tEditEvent(AttendanceType.WHITELIST)}
              </label>
            </div>

            {/* Individual Input */}
            <div className="flex gap-4 flex-col sm:flex-row w-full">
              <Input
                inputMode="numeric"
                maxLength={10}
                value={studentIdPermissionQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setStudentIdPermissionQuery(value);
                  }
                }}
                disabled={eventForm.attendance_type != AttendanceType.WHITELIST}
                placeholder={tEditEvent("whitelistPlaceholder")}
                className="body-large-primary"
              />

              <Button
                mode="filled"
                bordered="square"
                expanded={false}
                disabled={
                  eventForm.attendance_type != AttendanceType.WHITELIST ||
                  (studentIdPermissionQuery?.length != 10 &&
                    studentIdPermissionQuery?.length != 8) ||
                  selectedStudentIdsPermission?.includes(
                    studentIdPermissionQuery,
                  )
                }
                className={`w-fit h-9 shrink-0 ${
                  eventForm.attendance_type == AttendanceType.WHITELIST &&
                  (studentIdPermissionQuery?.length == 10 ||
                    studentIdPermissionQuery?.length == 8) &&
                  !selectedStudentIdsPermission?.includes(
                    studentIdPermissionQuery,
                  )
                    ? "cursor-pointer"
                    : "cursor-default border-neutral-400 text-neutral-400 bg-transparent"
                }`}
                onClick={() => {
                  if (eventForm.attendance_type != AttendanceType.WHITELIST)
                    return;

                  if (
                    studentIdPermissionQuery.length != 10 &&
                    studentIdPermissionQuery.length != 8
                  )
                    return;
                  if (
                    selectedStudentIdsPermission?.includes(
                      studentIdPermissionQuery,
                    )
                  )
                    return;

                  const student: Student = {
                    id: studentIdPermissionQuery,
                    name: "",
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

                  setSelectedStudentIdsPermission((prev) => [
                    ...prev,
                    studentIdPermissionQuery,
                  ]);
                  setStudentIdPermissionQuery("");
                }}
              >
                <p className="label-large-primary -translate-y-1">
                  {tEditEvent("whitelistAdd")}
                </p>
              </Button>
            </div>

            {/* Individual List */}
            {eventForm.selectedStudents.map((student) => (
              <div
                key={student.id}
                className={`flex items-center gap-2 border-b-2 py-2 ${eventForm.attendance_type != AttendanceType.WHITELIST && "opacity-50"}`}
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

                    setSelectedStudentIdsPermission((prev) => {
                      return prev.filter((id) => id != student.id);
                    });
                  }}
                  className={`${eventForm.attendance_type == AttendanceType.WHITELIST ? "text-primary cursor-pointer" : "text-neutral-500"}`}
                >
                  <IonIcon name="RemoveCircleOutline" size="18px" />
                </button>

                <p className="body-large-primary">{student.id}</p>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Scan Setting */}
      <div className="flex flex-col gap-4">
        <p className="title-large-emphasized mb-4">
          {tEditEvent("scanSetting")} <span className="text-primary">*</span>
        </p>

        {/* Image */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="scanSettingImages"
            className="cursor-pointer"
            onCheckedChange={() => {
              if (
                eventForm.revealed_fields.includes(ParticipantFieldType.PHOTO)
              ) {
                setEventForm({
                  ...eventForm,
                  revealed_fields: eventForm.revealed_fields.filter(
                    (field) => field != ParticipantFieldType.PHOTO,
                  ),
                });
              } else {
                setEventForm({
                  ...eventForm,
                  revealed_fields: [
                    ...eventForm.revealed_fields,
                    ParticipantFieldType.PHOTO,
                  ],
                });
              }
            }}
          />
          <label
            htmlFor="scanSettingImages"
            className="body-large-primary cursor-pointer"
          >
            {tEditEvent("scanSettingImages")}
          </label>
        </div>

        {/* Name */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="scanSettingName"
            className="cursor-pointer"
            onCheckedChange={() => {
              if (
                eventForm.revealed_fields.includes(ParticipantFieldType.NAME)
              ) {
                setEventForm({
                  ...eventForm,
                  revealed_fields: eventForm.revealed_fields.filter(
                    (field) => field != ParticipantFieldType.NAME,
                  ),
                });
              } else {
                setEventForm({
                  ...eventForm,
                  revealed_fields: [
                    ...eventForm.revealed_fields,
                    ParticipantFieldType.NAME,
                  ],
                });
              }
            }}
          />
          <label
            htmlFor="scanSettingName"
            className="body-large-primary cursor-pointer"
          >
            {tEditEvent("scanSettingName")}
          </label>
        </div>

        {/* Student Id */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="scanSettingId"
            className="cursor-pointer"
            onCheckedChange={() => {
              if (
                eventForm.revealed_fields.includes(ParticipantFieldType.REFID)
              ) {
                setEventForm({
                  ...eventForm,
                  revealed_fields: eventForm.revealed_fields.filter(
                    (field) => field != ParticipantFieldType.REFID,
                  ),
                });
              } else {
                setEventForm({
                  ...eventForm,
                  revealed_fields: [
                    ...eventForm.revealed_fields,
                    ParticipantFieldType.REFID,
                  ],
                });
              }
            }}
          />
          <label
            htmlFor="scanSettingId"
            className="body-large-primary cursor-pointer"
          >
            {tEditEvent("scanSettingId")}
          </label>
        </div>

        {/* Faculty */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="scanSettingFaculty"
            className="cursor-pointer"
            onCheckedChange={() => {
              if (
                eventForm.revealed_fields.includes(
                  ParticipantFieldType.ORGANIZATION,
                )
              ) {
                setEventForm({
                  ...eventForm,
                  revealed_fields: eventForm.revealed_fields.filter(
                    (field) => field != ParticipantFieldType.ORGANIZATION,
                  ),
                });
              } else {
                setEventForm({
                  ...eventForm,
                  revealed_fields: [
                    ...eventForm.revealed_fields,
                    ParticipantFieldType.ORGANIZATION,
                  ],
                });
              }
            }}
          />
          <label
            htmlFor="scanSettingFaculty"
            className="body-large-primary cursor-pointer"
          >
            {tEditEvent("scanSettingFaculty")}
          </label>
        </div>
      </div>

      {/* Accessibility */}
      <div className="flex flex-col gap-4">
        {/* Role */}
        <div className="flex flex-col gap-2 mb-4">
          <p className="title-large-emphasized mb-4">
            {tEditEvent("access")} <span className="text-primary">*</span>
          </p>

          <div className="flex flex-col gap-2">
            <p className="title-medium-emphasized">
              {tEditEvent("addEventManager")}
            </p>

            {/* Accessibility Input */}
            <div className="flex gap-4 flex-col sm:flex-row w-full">
              <Input
                inputMode="numeric"
                maxLength={10}
                value={studentIdAccessibilityQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setStudentIdAccessibilityQuery(value);
                  }
                }}
                placeholder={tEditEvent("addEventManagerIdPlaceholder")}
                className="flex-1 body-large-primary"
              />

              <Select
                value={roleAccessibilityQuery}
                onValueChange={(e) => {
                  setRoleAccessibilityQuery(e);
                }}
              >
                <SelectTrigger className="w-full flex-1 body-large-primary">
                  <SelectValue
                    placeholder={tEditEvent("addEventManagerRolePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent className="w-full flex-1">
                  <SelectGroup>
                    <SelectItem value={EventManagerType.MANAGER}>
                      <p className="body-large-primary">
                        {tEditEvent(EventManagerType.MANAGER)}
                      </p>
                    </SelectItem>
                    <SelectItem value={EventManagerType.STAFF}>
                      <p className="body-large-primary">
                        {tEditEvent(EventManagerType.STAFF)}
                      </p>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                mode="filled"
                bordered="square"
                expanded={false}
                disabled={
                  (studentIdAccessibilityQuery?.length != 10 &&
                    studentIdAccessibilityQuery?.length != 8) ||
                  selectedStudentIdsAccessibility?.includes(
                    studentIdAccessibilityQuery,
                  ) ||
                  roleAccessibilityQuery == ""
                }
                className={`w-fit h-9 shrink-0 ${
                  (studentIdAccessibilityQuery?.length == 10 ||
                    studentIdAccessibilityQuery?.length == 8) &&
                  !selectedStudentIdsAccessibility?.includes(
                    studentIdAccessibilityQuery,
                  ) &&
                  roleAccessibilityQuery != ""
                    ? "cursor-pointer"
                    : "cursor-default border-neutral-400 text-neutral-400 bg-transparent"
                }`}
                onClick={() => {
                  if (
                    studentIdAccessibilityQuery.length != 10 &&
                    studentIdAccessibilityQuery.length != 8
                  )
                    return;
                  if (
                    selectedStudentIdsAccessibility?.includes(
                      studentIdAccessibilityQuery,
                    )
                  )
                    return;
                  if (roleAccessibilityQuery == "") return;

                  // Not looking up the name via fetchUserByRefId: backend only
                  // checks its local `users` table, so a valid ref_id can still
                  // 404 if that person has never logged in / been scanned before.
                  const manager: EventManager = {
                    id: studentIdAccessibilityQuery,
                    name: "",
                    role: roleAccessibilityQuery,
                  };

                  setEventForm({
                    ...eventForm,
                    managers_and_staff: [
                      ...eventForm.managers_and_staff,
                      manager,
                    ].sort((a, b) => {
                      return Number(a.id) - Number(b.id);
                    }),
                  });

                  setSelectedStudentIdsAccessibility((prev) => [
                    ...prev,
                    studentIdAccessibilityQuery,
                  ]);

                  setRoleAccessibilityQuery("");
                  setStudentIdAccessibilityQuery("");
                }}
              >
                <p className="label-large-primary -translate-y-1">
                  {tEditEvent("addEventManager")}
                </p>
              </Button>
            </div>

            {/* Accessibility List */}
            {eventForm.managers_and_staff.map((student) => (
              <div
                key={student.id}
                className={`w-full flex items-center border-b-2 py-2 space-x-4 sm:space-x-8 space-y-2 flex-wrap sm:flex-nowrap`}
              >
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => {
                    const newStudents = eventForm.managers_and_staff
                      .filter((s) => s.id !== student.id)
                      .sort((a, b) => {
                        if (a.role == b.role) {
                          return Number(a.id) - Number(b.id);
                        }
                        return a.id.localeCompare(b.id, "th");
                      });

                    setEventForm({
                      ...eventForm,
                      managers_and_staff: newStudents,
                    });

                    setSelectedStudentIdsAccessibility((prev) => {
                      return prev.filter((id) => id != student.id);
                    });
                  }}
                  className={`text-primary cursor-pointer`}
                >
                  <IonIcon name="RemoveCircleOutline" size="18px" />
                </button>

                <div className="w-fit flex flex-col">
                  <p className="body-large-primary">{student.id}</p>
                </div>

                <Select
                  value={student.role}
                  onValueChange={(newRole) => {
                    const updated = eventForm.managers_and_staff.map((m) =>
                      m.id === student.id ? { ...m, role: newRole } : m,
                    );

                    setEventForm({
                      ...eventForm,
                      managers_and_staff: updated.sort((a, b) => {
                        return Number(a.id) - Number(b.id);
                      }),
                    });
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="flex-1">
                    <SelectGroup>
                      <SelectItem value={EventManagerType.MANAGER}>
                        {tEditEvent(EventManagerType.MANAGER)}
                      </SelectItem>

                      <SelectItem value={EventManagerType.STAFF}>
                        {tEditEvent(EventManagerType.STAFF)}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Allow All to Scan */}
        <div className="flex flex-col gap-2 mb-4">
          <p className="title-medium-emphasized mb-4">
            {tEditEvent("allowAllToScan")}{" "}
            <span className="text-primary">*</span>
          </p>

          <RadioGroup
            defaultValue={
              eventForm.allow_all_to_scan == true
                ? ScanPermissionType.ANYONE
                : ScanPermissionType.LIMITED
            }
            onValueChange={(value) => {
              let allow_all_to_scan = false;
              if (value == ScanPermissionType.ANYONE) {
                allow_all_to_scan = true;
              } else if (value == ScanPermissionType.LIMITED) {
                allow_all_to_scan = false;
              }
              setEventForm({
                ...eventForm,
                allow_all_to_scan,
              });
            }}
            className="w-full flex flex-col gap-6"
          >
            <div className="flex items-center space-x-4">
              <RadioGroupItem
                value={ScanPermissionType.LIMITED}
                id={ScanPermissionType.LIMITED}
                className="cursor-pointer"
              />
              <label
                htmlFor={ScanPermissionType.LIMITED}
                className="body-large-primary cursor-pointer"
              >
                {tEditEvent(ScanPermissionType.LIMITED)}
              </label>
            </div>
            <div className="flex items-center space-x-4">
              <RadioGroupItem
                value={ScanPermissionType.ANYONE}
                id={ScanPermissionType.ANYONE}
                className="cursor-pointer"
              />
              <label
                htmlFor={ScanPermissionType.ANYONE}
                className="body-large-primary cursor-pointer"
              >
                {tEditEvent(ScanPermissionType.ANYONE)}
              </label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default EditEventSection2;
