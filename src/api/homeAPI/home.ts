import { API } from "../API.ts";
import { HomeEndpoints } from "./constants.ts";

export const addHomeImage = async (data: FormData) =>
  API.post(HomeEndpoints.addHomeImage, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getHomeImages = async () => {
  const response = await API.get(HomeEndpoints.getHomeImages);
  return response.data;
};

export const addHomeAnnouncement = async (data: { text: string }) =>
  API.post(HomeEndpoints.addHomeAnnouncement, data);

export const getHomeAnnouncements = async () => {
  const response = await API.get(HomeEndpoints.getHomeAnnouncements);
  return response.data;
};

export const deleteHomeAnnouncement = async (id: number) =>
  API.delete(HomeEndpoints.deleteHomeAnnouncement(id));
