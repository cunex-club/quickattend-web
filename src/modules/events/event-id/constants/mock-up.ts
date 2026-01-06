import { EventInfo, ShareModalData } from "@customTypes/events";

// Mock data for event info page (index.tsx)
export const MOCK_EVENT_INFO: EventInfo = {
  name: "Freshmen night",
  organizer: "นายคหฤทธิ์ ครเนือง ณ อยุธยา",
  description:
    "กิจกรรมต้อนรับนิสิตใหม่ CU รุ่น 109 สู่รั้วมหาวิทยาลัย และ กระชับสัมพันธ์ อันดีระหว่างน้องใหม่คณะต่างๆภาย ในงานมีการจัด แสดงดนตรีโดยวงดนตรี อาทิเช่น Landokmai, Dept, Polycat, Tilly Birds, การแสดง พิเศษจาก CUDC และละครนิเทศ จุฬาฯ",
  date: "2025-08-03",
  start_time: "2025-08-03T16:00:00+07:00",
  end_time: "2025-08-03T20:00:00+07:00",
  location: "สนามกีฬาจุฬาลงกรณ์มหาวิทยาลัย",
  total_registered: 240,
  evaluation_form: "https://forms.example.com/evaluation",
  agenda: [
    {
      activity_name: "การแสดงพิเศษจาก CUDC",
      start_time: "2025-08-03T16:00:00+07:00",
      end_time: "2025-08-03T16:30:00+07:00",
    },
    {
      activity_name: "การแสดงจาก Landokmai",
      start_time: "2025-08-03T16:30:00+07:00",
      end_time: "2025-08-03T17:00:00+07:00",
    },
    {
      activity_name: "การแสดงจาก Dept",
      start_time: "2025-08-03T17:00:00+07:00",
      end_time: "2025-08-03T17:30:00+07:00",
    },
    {
      activity_name: "การแสดงจาก Polycat",
      start_time: "2025-08-03T17:30:00+07:00",
      end_time: "2025-08-03T18:00:00+07:00",
    },
    {
      activity_name: "การแสดงจาก Tilly Birds",
      start_time: "2025-08-03T18:00:00+07:00",
      end_time: "2025-08-03T19:00:00+07:00",
    },
    {
      activity_name: "ละครนิเทศ จุฬาฯ",
      start_time: "2025-08-03T19:00:00+07:00",
      end_time: "2025-08-03T20:00:00+07:00",
    },
  ],
};

// Mock data for share modal (fetched when modal opens)
export const MOCK_SHARE_MODAL_DATA: ShareModalData = {
  name: "Freshmen night",
  description:
    "กิจกรรมต้อนรับนิสิตใหม่ CU รุ่น 109 สู่รั้วมหาวิทยาลัย และ กระชับสัมพันธ์ อันดีระหว่างน้องใหม่คณะต่างๆภาย ในงานมีการจัด แสดงดนตรีโดยวงดนตรี อาทิเช่น Landokmai, Dept, Polycat, Tilly Birds, การแสดง พิเศษจาก CUDC และละครนิเทศ จุฬาฯ",
  organizer: "นายคหฤทธิ์ ครเนือง ณ อยุธยา",
  date: "2025-08-03",
  start_time: "2025-08-03T16:00:00+07:00",
  end_time: "2025-08-03T20:00:00+07:00",
  location: "สนามกีฬาจุฬาลงกรณ์มหาวิทยาลัย",
  agenda: [
    {
      activity_name: "การแสดงพิเศษจาก CUDC",
      start_time: "2025-08-03T16:00:00+07:00",
      end_time: "2025-08-03T16:30:00+07:00",
    },
    {
      activity_name: "การแสดงจาก Landokmai",
      start_time: "2025-08-03T16:30:00+07:00",
      end_time: "2025-08-03T17:00:00+07:00",
    },
    {
      activity_name: "การแสดงจาก Dept",
      start_time: "2025-08-03T17:00:00+07:00",
      end_time: "2025-08-03T17:30:00+07:00",
    },
    {
      activity_name: "การแสดงจาก Polycat",
      start_time: "2025-08-03T17:30:00+07:00",
      end_time: "2025-08-03T18:00:00+07:00",
    },
    {
      activity_name: "การแสดงจาก Tilly Birds",
      start_time: "2025-08-03T18:00:00+07:00",
      end_time: "2025-08-03T19:00:00+07:00",
    },
    {
      activity_name: "ละครนิเทศ จุฬาฯ",
      start_time: "2025-08-03T19:00:00+07:00",
      end_time: "2025-08-03T20:00:00+07:00",
    },
  ],
  attendance_type: "whitelist",
  attendee: [6641230021, 6891230025, 6710000022],
  revealed_fields: ["name", "organization", "refid"],
  managers_and_staff: [
    {
      id: 6630000021,
      role: "owner",
      name: "นายคหฤทธิ์ ครเนือง",
      organization: "คณะวิศวกรรมศาสตร์",
      avatar: "/placeholder-avatar.jpg",
    },
    {
      id: 6850000025,
      role: "manager",
      name: "นางสาวพฤศิตี สีกตี",
      organization: "คณะวิทยาศาสตร์",
      avatar: "/placeholder-avatar.jpg",
    },
  ],
  allow_all_to_scan: false,
  evaluation_form: "https://forms.example.com/evaluation",
};

