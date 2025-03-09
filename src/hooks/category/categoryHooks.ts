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
} from "../../api/categoryAPI/category.ts";

export const useGetAllCategories = (): UseQueryResult<Category[], Error> => {
  return useQuery({
    queryKey: ["getAllCategories"],
    queryFn: getAllCategories,
    refetchOnWindowFocus: false,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCategory: string) => createCategory(newCategory),
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
