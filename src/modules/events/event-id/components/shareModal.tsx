"use client";

import React from "react";
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

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareModal = ({ open, onOpenChange }: ShareModalProps) => {
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
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
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

              {/* User 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-neutral-100">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>นค</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">นายคหฤทธิ์ ครเนือง</div>
                    <div className="text-sm text-gray-600">
                      คณะวิศวกรรมศาสตร์
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Select defaultValue="owner" disabled>
                    <SelectTrigger className="w-32 border-0 shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* User 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-neutral-100">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>นจ</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">นางสาวพฤศิตี สีกตี</div>
                    <div className="text-sm text-gray-600">คณะวิทยาศาสตร์</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Select defaultValue="manager">
                    <SelectTrigger className="w-32 border-0 shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="viewer">ผู้ดูแลงาน</SelectItem>
                      <SelectItem value="remove" className="text-red-500">
                        ผู้จัดการกิจกรรม
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="border-b-2 mx-4 border-primary mt-6"></div>
            {/* Permissions Section */}
            <div className="flex items-center justify-between gap-3">
              <div className="headline-small-emphasized text-primary">
                สิทธิ์ผู้สามารถสแกน
              </div>
              <div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40 bg-neutral-white rounded-xl border-0 shadow-none">
                    <SelectValue placeholder="เลือกผู้สามารถแชทแทน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกคน</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
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
                <div className="flex items-center space-x-2">
                  <Checkbox id="general" defaultChecked />
                  <p className="title-medium-primary">แสดงทั้งหมด</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="datetime" defaultChecked />
                  <p className="title-medium-primary">รูปภาพ</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="upload" defaultChecked />
                  <p className="title-medium-primary">ชื่อ-นามสกุล</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="location" defaultChecked />
                  <p className="title-medium-primary">รหัสประจำตัว</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="additional" defaultChecked />
                  <p className="title-medium-primary">คณะ/หน่วยงาน</p>
                </div>
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
