import { Category } from "../../../../../../api/categoryAPI/types";

export type BlockedCategoriesPopupProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCategories: number[];
  setSelectedCategories: (ids: number[]) => void;
  topLevelCategories: Category[];
  email?: string;
};
