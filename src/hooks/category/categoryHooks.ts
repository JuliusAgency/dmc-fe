import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { Category } from "../../api/categoryAPI/types.ts";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  CreateCategoryDto,
} from "../../api/categoryAPI/category.ts";

export const useParentCategories = () => {
  const queryData = useGetAllCategories();

  return {
    ...queryData,
    data: queryData.data?.filter((cat) => !cat.parentCategory),
  };
};

export const useChildCategories = () => {
  const queryData = useGetAllCategories();

  return {
    ...queryData,
    data: queryData.data?.filter((cat) => cat.parentCategory),
  };
};

const useGetAllCategories = (): UseQueryResult<Category[], Error> => {
  return useQuery({
    queryKey: ["getAllCategories"],
    queryFn: getAllCategories,
    refetchOnWindowFocus: false,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: CreateCategoryDto) =>
      createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });
    },
  });
};

export const useGetCategoryById = (categoryId?: number): UseQueryResult<Category | undefined, Error> => {
  const categoriesQuery = useGetAllCategories();
  
  return useQuery({
    queryKey: ["getCategory", categoryId],
    queryFn: () => {
      // Find the category with the matching ID from all categories
      return categoriesQuery.data?.find(category => category.id === categoryId);
    },
    enabled: !!categoryId && !!categoriesQuery.data,
    refetchOnWindowFocus: false,
  });
};
