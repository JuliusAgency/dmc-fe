import { API } from "../API.ts";
import { HomeEndpoints } from "./constants.ts";

export const getHomeImages = async () => {
  const response = await API.get(HomeEndpoints.getHomeImages);
  return response.data;
};

export const getHomeAnnouncements = async () => {
  const response = await API.get(HomeEndpoints.getHomeAnnouncements);
  return response.data;
};
