"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@assets/components/ui/dialog";
import Button from "@shared/Button";

type NoActiveEventsModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const NoActiveEventsModal = ({
  open,
  onCancel,
  onConfirm,
}: NoActiveEventsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent
        showCloseButton={false}
        className="w-[min(94vw,640px)] rounded-[32px] border-0 bg-neutral-white p-6 md:p-8"
      >
        <DialogTitle className="text-center headline-large-emphasized text-neutral-600">
          แจ้งเตือน
        </DialogTitle>

        <div className="text-center title-large-primary text-neutral-600 pt-2 pb-4">
          ท่านไม่มีกิจกรรมที่กำลังจัดอยู่ในเวลา ณ ขณะนี้
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <Button
            mode="outline"
            bordered="round"
            expanded
            onClick={onCancel}
            className="title-medium-emphasized text-neutral-600"
          >
            <div className="title-medium-emphasized">ยกเลิก</div>
          </Button>
          <Button mode="filled" bordered="round" expanded onClick={onConfirm}>
            <div className="title-medium-emphasized">ตกลง</div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoActiveEventsModal;
