import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { Category } from "../../api/categoryAPI/types";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  CreateCategoryDto,
} from "../../api/categoryAPI/category";
import { snackBarSuccess, snackBarError } from "../../components/toast/Toast";
import {
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_CREATE_ERROR,
  CATEGORY_DELETE_SUCCESS,
  CATEGORY_DELETE_ERROR,
} from "./constants";

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
    mutationFn: (categoryData: CreateCategoryDto) =>
      createCategory(categoryData),
    onSuccess: () => {
      snackBarSuccess(CATEGORY_CREATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });
    },
    onError: () => {
      snackBarError(CATEGORY_CREATE_ERROR);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    onSuccess: () => {
      snackBarSuccess(CATEGORY_DELETE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });
    },
    onError: () => {
      snackBarError(CATEGORY_DELETE_ERROR);
    },
  });
};

export const useGetCategoryById = (
  categoryId?: number
): UseQueryResult<Category | undefined, Error> => {
  const categoriesQuery = useGetAllCategories();

  return useQuery({
    queryKey: ["getCategory", categoryId],
    queryFn: () => {
      return categoriesQuery.data?.find(
        (category) => category.id === categoryId
      );
    },
    enabled: !!categoryId && !!categoriesQuery.data,
    refetchOnWindowFocus: false,
  });
};
