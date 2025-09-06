export interface CategoryData {
  _id: string;
  title: string;
  slug: string;
  image: string;
}

export interface CategoryState {
  categories: CategoryData[];
  isLoadingCategory: boolean;
  isLoadingCreateCategory: boolean;
  errorCreateCategory: string;
}
