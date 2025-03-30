import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  getAllTags,
  createTag,
  deleteTag,
  updateTag,
} from "../../api/tagsAPI/tag";
import { Tag } from "../../api/tagsAPI/types";
import { snackBarError, snackBarSuccess } from "../../components/toast/Toast";
import {
  TAGS_CREATE_SUCCESS,
  TAGS_CREATE_ERROR,
  TAGS_UPDATE_SUCCESS,
  TAGS_UPDATE_ERROR,
  TAGS_DELETE_SUCCESS,
  TAGS_DELETE_ERROR,
} from "./constants";

export const useGetAllTags = (): UseQueryResult<Tag[], Error> => {
  return useQuery({
    queryKey: ["getAllTags"],
    queryFn: getAllTags,
    refetchOnWindowFocus: false,
  });
};

export const useEditTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTag: { id: number; name: string }) =>
      updateTag(newTag.id, newTag.name),
    onSuccess: () => {
      snackBarSuccess(TAGS_UPDATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["getAllTags"] });
    },
    onError: () => {
      snackBarError(TAGS_UPDATE_ERROR);
    },
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTag: string) => createTag(newTag),
    onSuccess: () => {
      snackBarSuccess(TAGS_CREATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["getAllTags"] });
    },
    onError: () => {
      snackBarError(TAGS_CREATE_ERROR);
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId: number) => deleteTag(tagId),
    onSuccess: () => {
      snackBarSuccess(TAGS_DELETE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["getAllTags"] });
    },
    onError: () => {
      snackBarError(TAGS_DELETE_ERROR);
    },
  });
};
