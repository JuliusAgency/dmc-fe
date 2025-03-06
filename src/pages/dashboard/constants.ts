export const DASHBOARD_TITLE = "System Management Dashboard";

export const TAB_LABELS = [
  "User Management",
  "Homepage Management",
  "Category Management",
];

import { ManageUsers } from "./components/manageUsers";
import ManageHomePage from "./components/manageHomePage";
import { ManageCategories } from "./components/manageCategories";

export const TAB_COMPONENTS = [ManageUsers, ManageHomePage, ManageCategories];
