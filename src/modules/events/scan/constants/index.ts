export type ScanEvent = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  role?: string | null;
};

export type Participant = {
  id: string;
  name: string;
  time: string;
};
