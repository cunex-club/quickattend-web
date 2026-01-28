export const ROLE_OPTIONS = [
  { value: "owner", label: "Roles.owner" },
  { value: "manager", label: "Roles.manager" },
  { value: "viewer", label: "Roles.viewer" },
];

export const MANAGER_ROLE_OPTIONS = [
  { value: "manager", label: "Roles.manager" },
  { value: "viewer", label: "Roles.worker" },
  {
    value: "remove",
    label: "Roles.manager_remove",
    className: "text-red-500",
  },
];

export const SCAN_PERMISSION_OPTIONS = [
  { value: "all", label: "ScanPermissions.all" },
  { value: "manager", label: "ScanPermissions.manager" },
  { value: "owner", label: "ScanPermissions.owner" },
  { value: "viewer", label: "ScanPermissions.viewer" },
];

export const REVEALED_FIELDS_OPTIONS = [
  { id: "general", label: "RevealedFields.all", field: "all" },
  { id: "datetime", label: "RevealedFields.image", field: "image" },
  { id: "upload", label: "RevealedFields.name", field: "name" },
  { id: "location", label: "RevealedFields.refid", field: "refid" },
  {
    id: "additional",
    label: "RevealedFields.organization",
    field: "organization",
  },
];

export const ACCESS_ROLE_OPTIONS = [
  { value: "owner", label: "Roles.owner" },
  { value: "manager", label: "Roles.manager" },
  { value: "staff", label: "Roles.staff" },
  { value: "worker", label: "Roles.worker" },
  {
    value: "remove",
    label: "Roles.remove",
    className: "text-red-500",
  },
];
