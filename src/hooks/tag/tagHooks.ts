import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { getAllTags, createTag, deleteTag } from "../../api/tagsAPI/tag.ts";
import { Tag } from "../../api/tagsAPI/types.ts";

export const useGetAllTags = (): UseQueryResult<Tag[], Error> => {
  return useQuery({
    queryKey: ["getAllTags"],
    queryFn: getAllTags,
    refetchOnWindowFocus: false,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTag: string) => createTag(newTag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllTags"] });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId: number) => deleteTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllTags"] });
    },
  });
};
