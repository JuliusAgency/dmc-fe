export type UserRole = "USER" | "ADMIN" | "SYSTEM_ADMIN";

export interface RoleOption {
  value: UserRole;
  label: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  { value: "USER", label: "USER" },
  { value: "ADMIN", label: "ADMIN" },
  { value: "SYSTEM_ADMIN", label: "SYSTEM_ADMIN" },
];

export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}
