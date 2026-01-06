export const ROLE_OPTIONS = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
  { value: "viewer", label: "Viewer" },
];

export const MANAGER_ROLE_OPTIONS = [
  { value: "manager", label: "Manager" },
  { value: "viewer", label: "ผู้ดูแลงาน" },
  { value: "remove", label: "ผู้จัดการกิจกรรม", className: "text-red-500" },
];

export const SCAN_PERMISSION_OPTIONS = [
  { value: "all", label: "ทุกคน" },
  { value: "manager", label: "Manager" },
  { value: "owner", label: "Owner" },
  { value: "viewer", label: "Viewer" },
];

export const REVEALED_FIELDS_OPTIONS = [
  { id: "general", label: "แสดงทั้งหมด", field: "all" },
  { id: "datetime", label: "รูปภาพ", field: "image" },
  { id: "upload", label: "ชื่อ-นามสกุล", field: "name" },
  { id: "location", label: "รหัสประจำตัว", field: "refid" },
  { id: "additional", label: "คณะ/หน่วยงาน", field: "organization" },
];

