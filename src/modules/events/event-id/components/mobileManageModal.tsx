"use client";

import { useState } from "react";

import Button from "@shared/Button";
import { cn } from "@assets/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@assets/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@assets/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@assets/components/ui/avatar";
import IonIcon from "@shared/IonIcon";
import { ShareModalData } from "@customTypes/events";
import {
  ROLE_OPTIONS,
  MANAGER_ROLE_OPTIONS,
  ACCESS_ROLE_OPTIONS,
} from "@modules/events/event-id/constants/constant";

interface MobileManageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventData: ShareModalData;
  onDuplicate?: () => void;
}

const MobileManageModal = ({
  open,
  onOpenChange,
  eventData,
  onDuplicate,
}: MobileManageModalProps) => {
  const [view, setView] = useState<"main" | "add-access">("main");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("manager");

  const resetState = () => {
    setView("main");
    setUsername("");
    setRole("manager");
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) resetState();
      }}
    >
      <SheetContent
        side="bottom"
        className="bg-white rounded-t-[20px] px-6 pb-10 pt-4 h-auto max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader className="mb-6 relative">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-neutral-200 mb-2" />
          <div className="flex items-center justify-center relative">
            {view === "add-access" && (
              <button
                onClick={() => setView("main")}
                className="absolute left-0 text-neutral-900 p-1"
              >
                <IonIcon name="ChevronBack" className="w-6 h-6" />
              </button>
            )}
            <SheetTitle
              className={cn(
                "headline-medium-emphasized text-center",
                view === "main" ? "text-primary" : "text-pink-500"
              )}
            >
              {view === "main" ? "จัดการกิจกรรม" : "เพิ่มผู้เข้าถึงกิจกรรม"}
            </SheetTitle>
          </div>
        </SheetHeader>

        {view === "main" ? (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Actions Section */}
            <div className="flex flex-col gap-4">
              <button className="flex items-center gap-3 w-full">
                <div className="text-primary">
                  <IonIcon name="TrendingUp" className="w-6 h-6" />
                </div>
                <span className="body-large-primary">
                  คัดลอกลิงก์แชร์ Dashboard
                </span>
              </button>
              <button className="flex items-center gap-3 w-full">
                <div className="text-primary">
                  <IonIcon name="Scan" className="w-6 h-6" />
                </div>
                <span className="body-large-primary">
                  คัดลอกลิงก์แชร์ QR scanner
                </span>
              </button>
              <button
                className="flex items-center gap-3 w-full"
                onClick={onDuplicate}
              >
                <div className="text-primary">
                  <IonIcon name="DuplicateOutline" className="w-6 h-6" />
                </div>
                <span className="body-large-primary">ทำซ้ำกิจกรรม</span>
              </button>
            </div>

            <div className="h-[1px] bg-neutral-200 w-full" />

            {/* Add Access Section */}
            <button
              className="flex items-center justify-between w-full"
              onClick={() => setView("add-access")}
            >
              <div className="flex items-center gap-3">
                <div className="text-primary">
                  <IonIcon name="PersonAddOutline" className="w-6 h-6" />
                </div>
                <span className="body-large-primary">
                  เพิ่มผู้สามารถเข้าถึงกิจกรรม
                </span>
              </div>
              <IonIcon
                name="ChevronForward"
                className="text-neutral-500 w-6 h-6"
              />
            </button>

            {/* Users List Section */}
            <div className="space-y-4">
              <h3 className="headline-small-emphasized">ผู้เข้าถึงกิจกรรม</h3>

              <div className="flex flex-col gap-4">
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
                        <Avatar className="h-10 w-10 border border-neutral-100">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="label-large-emphasized">
                            {user.name}
                          </div>
                          <div className="label-medium-primary text-gray-600">
                            {user.organization}
                          </div>
                        </div>
                      </div>
                      {isOwner ? (
                        <div className="label-medium-primary text-gray-500">
                          เจ้าของกิจกรรม
                        </div>
                      ) : (
                        <div className="label-medium-primary text-gray-500">
                          ผู้จัดการกิจกรรม
                        </div>
                      )}
                      <IonIcon
                        name="ChevronDown"
                        className="text-primary w-5 h-5"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-300 h-full">
            <div className="space-y-6 flex-1">
              <input
                placeholder="ระบุรหัสประจำตัว"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-100 border-none rounded-xl py-4 px-6 body-large-primary placeholder:text-neutral-400 outline-none"
              />

              <div className="flex items-center justify-between">
                <div className="headline-small-emphasized text-black">
                  สิทธิ์การเข้าถึง
                </div>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-50 h-12 rounded-2xl border-none shadow-sm bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="label-medium-primary">
                    {ACCESS_ROLE_OPTIONS.map((option) => (
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
              </div>
            </div>

            <div className="mt-auto pt-6 flex justify-center">
              <Button
                mode="filled"
                bordered="round"
                expanded={false}
                className={cn(
                  "title-large-emphasized px-8 py-3 transition-colors min-w-[200px]",
                  !username
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed hover:bg-neutral-200"
                    : "bg-pink-500 text-white hover:bg-pink-600 border-pink-500"
                )}
                disabled={!username}
                onClick={() => {
                  console.log("Add access", { username, role });
                  resetState();
                  onOpenChange(false);
                }}
              >
                ยืนยันเพิ่มผู้เข้าถึงกิจกรรม
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileManageModal;
