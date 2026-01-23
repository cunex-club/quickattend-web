"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@assets/components/ui/dialog";
import { Input } from "@assets/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@assets/components/ui/select";
import { Checkbox } from "@assets/components/ui/checkbox";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@assets/components/ui/avatar";
import Button from "@shared/Button";
import IonIcon from "@shared/IonIcon";
import { ShareModalData } from "@customTypes/events";
import {
  ROLE_OPTIONS,
  MANAGER_ROLE_OPTIONS,
  SCAN_PERMISSION_OPTIONS,
  REVEALED_FIELDS_OPTIONS,
} from "@modules/events/event-id/constants/constant";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventData: ShareModalData;
}

const ShareModal = ({ open, onOpenChange, eventData }: ShareModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-2xl bg-transparent shadow-none border-none p-0 outline-none flex flex-col gap-4"
        showCloseButton={false}
      >
        <div className="bg-neutral-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <DialogHeader>
            <DialogTitle className="headline-large-emphasized text-primary">
              จัดการสิทธิ์เข้าถึง
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Search and Add Section */}
            <div className="flex gap-3">
              <div className="flex bg-neutral-100 rounded-xl flex-1 gap-2 p-2">
                <div className="flex-1 relative title-medium-primary">
                  <Input
                    placeholder="ระบุชื่อประจำตัวเพื่อเพิ่มผู้เข้าร่วมกิจกรรมที่ต้องการ"
                    className="w-full bg-transparent border-none shadow-none focus-visible:ring-0"
                  />
                </div>
                <Select defaultValue="manager">
                  <SelectTrigger className="w-32 title-medium-primary bg-neutral-white shadow-sm border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                mode="outline"
                bordered="round"
                expanded={false}
                className="title-medium-primary bg-neutral-100 border-0 w-20"
              >
                เพิ่ม
              </Button>
            </div>

            {/* Event Access Users Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">ผู้เข้าถึงกิจกรรม</h3>

              {eventData.managers_and_staff.map((user) => {
                const isOwner = user.role === "owner";
                const initials = user.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("");

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border border-neutral-100">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600">
                          {user.organization}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isOwner ? (
                        <Select defaultValue="owner" disabled>
                          <SelectTrigger className="w-32 border-0 shadow-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.slice(0, 2).map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Select defaultValue={user.role}>
                          <SelectTrigger className="w-32 border-0 shadow-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MANAGER_ROLE_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className={option.className}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-b-2 mx-4 border-primary mt-6"></div>
            {/* Permissions Section */}
            <div className="flex items-center justify-between gap-3">
              <div className="headline-small-emphasized text-primary">
                สิทธิ์ผู้สามารถสแกน
              </div>
              <div>
                <Select
                  defaultValue={eventData.allow_all_to_scan ? "all" : "manager"}
                >
                  <SelectTrigger className="w-40 bg-neutral-white rounded-xl border-0 shadow-none">
                    <SelectValue placeholder="เลือกผู้สามารถแชทแทน" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCAN_PERMISSION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Settings Section */}
            <div className="space-y-3">
              <h3 className="headline-small-emphasized text-primary">
                ตั้งค่าผลลัพธ์การสแกน
              </h3>
              <div className="flex flex-wrap justify-between gap-x-8 gap-y-4">
                {REVEALED_FIELDS_OPTIONS.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      defaultChecked={eventData.revealed_fields.includes(
                        field.field
                      )}
                    />
                    <p className="title-medium-primary">{field.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-neutral-white p-2 rounded-xl shadow-sm border border-neutral-200">
          <div className="space-y-1">
            <button className="flex items-center gap-4 w-full py-2.5 px-4 hover:bg-neutral-50 rounded-lg transition-colors text-left">
              <div className="text-primary">
                <IonIcon name="ScanOutline" size="32px" />
              </div>
              <span className="body-large-primary font-bold">
                คัดลอก QR scanner
              </span>
            </button>
            <button className="flex items-center gap-4 w-full py-2.5 px-4 hover:bg-neutral-50 rounded-lg transition-colors text-left">
              <div className="text-primary">
                <IonIcon name="TrendingUp" size="32px" />
              </div>
              <span className="body-large-primary font-bold">
                คัดลอก Dashboard
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
