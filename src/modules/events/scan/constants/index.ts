export type ScanEvent = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

export type Participant = {
  id: string;
  name: string;
  time: string;
};

export const MOCK_EVENTS: ScanEvent[] = [
  {
    id: "freshmen-night",
    name: "Freshmen night",
    startTime: "16:00",
    endTime: "21:00",
  },
  {
    id: "orientation-day",
    name: "Orientation day",
    startTime: "13:00",
    endTime: "18:00",
  },
  {
    id: "welcome-party",
    name: "Welcome party",
    startTime: "17:30",
    endTime: "22:00",
  },
];

export const MOCK_RECENT_PARTICIPANTS: Participant[] = [
  { id: "652392178", name: "นางสาวปรียดา สวัสดีสุข", time: "16:20 น." },
  { id: "672392178", name: "นายปฏิภัค สวัสดี", time: "16:23 น." },
  { id: "662392378", name: "นายปฏิภัค สวัสดี", time: "16:28 น." },
];

export const TOTAL_PARTICIPANTS = 240;
