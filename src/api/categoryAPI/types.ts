export interface Category {
  id: number;
  name: string;

  childCategories: Category[];
  parentCategoryId?: number;
  parentCategory?: Category;
}
