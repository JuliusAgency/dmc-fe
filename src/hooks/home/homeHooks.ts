import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  getHomeImages,
  addHomeImage,
  getHomeAnnouncements,
  addHomeAnnouncement,
  deleteHomeAnnouncement,
} from "../../api/homeAPI/home.ts";

export const useGetHomeImages = (): UseQueryResult<
  { imageUrl: string },
  Error
> => {
  return useQuery({
    queryKey: ["homeImages"],
    queryFn: getHomeImages,
    refetchOnWindowFocus: false,
  });
};

export const useUploadHomeImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("name", "Homepage Image");
      formData.append("image", file);
      return addHomeImage(formData);
    },
    onSuccess: () => {
      alert("Homepage image uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["homeImages"] });
    },
  });
};

export const useGetHomeAnnouncements = (): UseQueryResult<
  { id: number; text: string }[],
  Error
> => {
  return useQuery({
    queryKey: ["homeAnnouncements"],
    queryFn: getHomeAnnouncements,
    refetchOnWindowFocus: false,
  });
};

export const useAddHomeAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!text) throw new Error("Announcement text is required.");
      return addHomeAnnouncement({ text });
    },
    onSuccess: () => {
      alert("Announcement added successfully!");
      queryClient.invalidateQueries({ queryKey: ["homeAnnouncements"] });
    },
  });
};

export const useDeleteHomeAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => deleteHomeAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeAnnouncements"] });
    },
  });
};
