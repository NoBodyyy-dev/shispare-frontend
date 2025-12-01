export interface CategoryData {
  _id: string;
  title: string;
  slug: string;
  level: number; // 1 - основная категория, 2 - подкатегория
  image?: string; // Опциональное поле (может отсутствовать)
}

export interface CategoryState {
  categories: CategoryData[];
  isLoadingCategory: boolean;
  isLoadingCreateCategory: boolean;
  errorCreateCategory: string;
}
