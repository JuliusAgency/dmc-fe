export const DASHBOARD_TITLE = "System Management Dashboard";

export const TAB_LABELS = [
  "User Management",
  "Homepage Management",
  "Category Management",
  "Part Number Management",
  "Signature Groups Management",
];

import { ManageUsers } from "./components/manageUsers";
import ManageHomePage from "./components/manageHomePage";
import { ManageCategories } from "./components/manageCategories";
import { ManagePartNumbers } from "./components/managePartNumbers";
import { ManageSignatureGroups } from "./components/manageSignatureGroups";

export const TAB_COMPONENTS = [
  ManageUsers,
  ManageHomePage,
  ManageCategories,
  ManagePartNumbers,
  ManageSignatureGroups,
];
