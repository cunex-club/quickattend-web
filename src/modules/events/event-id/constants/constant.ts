export const ROLE_OPTIONS = [
  { value: "owner", label: "EventDetail.Roles.owner" },
  { value: "manager", label: "EventDetail.Roles.manager" },
  { value: "viewer", label: "EventDetail.Roles.viewer" },
];

export const MANAGER_ROLE_OPTIONS = [
  { value: "manager", label: "EventDetail.Roles.manager" },
  { value: "viewer", label: "EventDetail.Roles.worker" },
  {
    value: "remove",
    label: "EventDetail.Roles.manager_remove",
    className: "text-red-500",
  },
];

export const SCAN_PERMISSION_OPTIONS = [
  { value: "all", label: "EventDetail.ScanPermissions.all" },
  { value: "manager", label: "EventDetail.ScanPermissions.manager" },
  { value: "owner", label: "EventDetail.ScanPermissions.owner" },
  { value: "viewer", label: "EventDetail.ScanPermissions.viewer" },
];

export const REVEALED_FIELDS_OPTIONS = [
  { id: "general", label: "EventDetail.RevealedFields.all", field: "all" },
  { id: "datetime", label: "EventDetail.RevealedFields.image", field: "image" },
  { id: "upload", label: "EventDetail.RevealedFields.name", field: "name" },
  { id: "location", label: "EventDetail.RevealedFields.refid", field: "refid" },
  {
    id: "additional",
    label: "EventDetail.RevealedFields.organization",
    field: "organization",
  },
];

export const ACCESS_ROLE_OPTIONS = [
  { value: "owner", label: "EventDetail.Roles.owner" },
  { value: "manager", label: "EventDetail.Roles.manager" },
  { value: "staff", label: "EventDetail.Roles.staff" },
  { value: "worker", label: "EventDetail.Roles.worker" },
  {
    value: "remove",
    label: "EventDetail.Roles.remove",
    className: "text-red-500",
  },
];
