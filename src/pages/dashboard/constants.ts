export const DASHBOARD_TITLE = "דשבורד ניהול מערכת";

export const TAB_LABELS = ["ניהול משתמשים", "ניהול דף הבית", "ניהול קטגוריות"];

import ManageUsers from "./components/manageUsers";
import ManageHomePage from "./components/manageHomePage";
import ManageCategories from "./components/manageCategories";

export const TAB_COMPONENTS = [ManageUsers, ManageHomePage, ManageCategories];
export const USERS_TITLE = "ניהול משתמשים";
export const CREATE_USER_BUTTON = "צור משתמש";
export const EMAIL_LABEL = "אימייל";
export const PASSWORD_LABEL = "סיסמה";
export const ROLE_LABEL = "תפקיד";
export const RESET_PASSWORD_BUTTON = "אפס סיסמה";
export const CREATE_USER_TITLE = "יצירת משתמש חדש";
export const CANCEL_BUTTON = "ביטול";
export const SAVE_USER_BUTTON = "צור משתמש";

export const ROLE_OPTIONS = [
  { value: "USER", label: "USER" },
  { value: "ADMIN", label: "ADMIN" },
  { value: "SYSTEM_ADMIN", label: "SYSTEM_ADMIN" },
];
