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
} from "../../api/homeAPI/home";
import { snackBarSuccess, snackBarError } from "../../components/toast/Toast";
import {
  HOME_IMAGE_UPLOAD_SUCCESS,
  HOME_IMAGE_UPLOAD_ERROR,
  HOME_ANNOUNCEMENT_ADD_SUCCESS,
  HOME_ANNOUNCEMENT_ADD_ERROR,
  HOME_ANNOUNCEMENT_REQUIRED,
  HOME_ANNOUNCEMENT_DELETE_SUCCESS,
  HOME_ANNOUNCEMENT_DELETE_ERROR,
} from "./constants";

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
      snackBarSuccess(HOME_IMAGE_UPLOAD_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["homeImages"] });
    },
    onError: () => {
      snackBarError(HOME_IMAGE_UPLOAD_ERROR);
    },
  });
};

export const useGetHomeAnnouncements = (): UseQueryResult<
  { id: number; text: string; createdAt: string }[],
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
      if (!text) throw new Error(HOME_ANNOUNCEMENT_REQUIRED);
      return addHomeAnnouncement({ text });
    },
    onSuccess: () => {
      snackBarSuccess(HOME_ANNOUNCEMENT_ADD_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["homeAnnouncements"] });
    },
    onError: () => {
      snackBarError(HOME_ANNOUNCEMENT_ADD_ERROR);
    },
  });
};

export const useDeleteHomeAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => deleteHomeAnnouncement(id),
    onSuccess: () => {
      snackBarSuccess(HOME_ANNOUNCEMENT_DELETE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["homeAnnouncements"] });
    },
    onError: () => {
      snackBarError(HOME_ANNOUNCEMENT_DELETE_ERROR);
    },
  });
};
